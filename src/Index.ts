import * as CookieCore from "cookie";
import { Kanro } from "kanro.core";

declare module "kanro.core" {
    namespace Kanro {
        namespace Core {
            interface IRequest {
                cookies: { [name: string]: string };
            }
        }
    }
}

export namespace Cookie {
    export class CookieParser extends Kanro.BaseRequestHandler {
        async handler(request: Kanro.Core.IRequest): Promise<Kanro.Core.IRequest> {
            if (request.header["cookie"] != undefined) {
                request.cookies = CookieCore.parse(request.header["cookie"]);
            }
            return request;
        }
        type: Kanro.Core.ExecutorType.RequestHandler = Kanro.Core.ExecutorType.RequestHandler;
        name: string = "CookieParser";

        constructor(config: Kanro.Config.IRequestHandlerConfig) {
            super(config);
        }
    }

    export class KanroCookieModule implements Kanro.Core.IModule {
        dependencies: Kanro.Core.IModuleInfo[];

        executorInfos: { [name: string]: Kanro.Core.IExecutorInfo; };
        async getExecutor(config: Kanro.Config.IExecutorConfig): Promise<Kanro.Core.IExecutor> {
            if (config.name == "CookieParser") {
                return new CookieParser(<any>config);
            }
            return undefined;
        }

        public constructor() {
            this.executorInfos = { CookieParser: { type: Kanro.Core.ExecutorType.RequestHandler, name: "CookieParser" } };
        }
    }
}

export let KanroModule = new Cookie.KanroCookieModule(); 