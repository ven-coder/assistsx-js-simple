import { AssistsX, NodeClassValue } from "ax-web-dev"
import { delay, Observable, Subject, Subscription, takeUntil, from, concatMap, of, firstValueFrom } from "rxjs";

const targetPackageName = "com.tencent.mm"

const stop$ = new Subject<void>();

export type CancelableTask = {
    cancel: () => void;
};

// 定义可取消的上下文
class CancellationContext {
    private _isCancelled = false;
    private _onCancel?: () => void;

    get isCancelled(): boolean {
        return this._isCancelled;
    }

    cancel() {
        this._isCancelled = true;
        this._onCancel?.();
    }

    onCancel(callback: () => void) {
        this._onCancel = callback;
    }
}

// 创建一个延时函数
const delay$ = (ms: number): Observable<void> =>
    new Observable<void>(observer => {
        const timer = setTimeout(() => {
            observer.next();
            observer.complete();
        }, ms);
        return () => clearTimeout(timer);
    }).pipe(takeUntil(stop$));

// 定义协程执行器
type CoroutineResult<T> = Generator<Observable<any>, T, any>;

async function runCoroutine<T>(
    generator: () => CoroutineResult<T>,
    context: CancellationContext
): Promise<T> {
    const iterator = generator();
    let result: any;

    while (true) {
        if (context.isCancelled) {
            throw new Error('Coroutine cancelled');
        }

        const { value, done } = iterator.next(result);

        if (done) {
            return value;
        }

        // 等待 Observable 完成
        result = await firstValueFrom(value);
    }
}

// 主要业务逻辑
function* collectWechatInfoCoroutine(context: CancellationContext): CoroutineResult<void> {
    // 启动微信
    AssistsX.launchApp(targetPackageName);
    yield delay$(1000);

    // 检查微信是否打开
    for (let i = 0; i < 5; i++) {
        if (context.isCancelled) return;

        const packageName = AssistsX.getPackageName();
        if (packageName === targetPackageName) {
            break;
        }

        const node = AssistsX.findById("com.miui.securitycore:id/app1");
        if (node[0]) {
            node[0].click();
            break;
        }

        yield delay$(1000);
    }

    // 等待微信完全打开
    yield delay$(1000);

    // 检查微信状态
    const packageName = AssistsX.getPackageName();
    if (packageName !== targetPackageName) {
        AssistsX.overlayToast("微信打开失败");
        return;
    }

    // 查找并点击个人信息入口
    while (!context.isCancelled) {
        const nodes = AssistsX.findByTags(NodeClassValue.RelativeLayout, "", "com.tencent.mm:id/huj", "");
        if (nodes.length > 0) {
            const meNodes = AssistsX.findByTags(NodeClassValue.TextView, "我", "com.tencent.mm:id/icon_tv", "");
            if (meNodes.length > 0) {
                const node = meNodes[0].findFirstParentClickable();
                if (node) {
                    node.click();
                    yield delay$(1000);

                    // 获取账号信息
                    const infoNodes = AssistsX.findById("com.tencent.mm:id/ouv");
                    if (infoNodes.length > 0) {
                        AssistsX.overlayToast(infoNodes[0].text);
                    }
                    break;
                }
            }
        } else {
            AssistsX.back();
            yield delay$(1000);
        }
    }
}

// 包装成可取消的任务
export function runCancelableTask(
    create$: () => Observable<any>
): CancelableTask {
    const cancel$ = new Subject<void>();
    const subscription: Subscription = create$()
        .pipe(takeUntil(cancel$))
        .subscribe();

    return {
        cancel() {
            cancel$.next();
            cancel$.complete();
            subscription.unsubscribe();
            stop$.next();
            stop$.complete();
        },
    };
}

// 主入口
export const mainCollectAccountInfo = (): CancelableTask => {
    const context = new CancellationContext();

    return runCancelableTask(() => {
        return new Observable<void>(observer => {
            // 运行协程
            runCoroutine(() => collectWechatInfoCoroutine(context), context)
                .then(() => {
                    observer.next();
                    observer.complete();
                })
                .catch(error => {
                    if (error.message === 'Coroutine cancelled') {
                        observer.complete();
                    } else {
                        observer.error(error);
                    }
                });

            // 返回清理函数
            return () => {
                context.cancel();
            };
        });
    });
}
