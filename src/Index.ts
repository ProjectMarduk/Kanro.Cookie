import * as CookieCore from "cookie";
import { Kanro } from "kanro";

declare module "kanro" {
    namespace Kanro {
        namespace Http {
            interface IRequest {
                cookies?: { [name: string]: string };
            }
        }
    }
}

export namespace Cookie {
    export class CookieParser extends Kanro.Executors.BaseRequestHandler {
        async handler(request: Kanro.Http.IRequest): Promise<Kanro.Http.IRequest> {
            if (request.header["cookie"] != undefined) {
                request.cookies = CookieCore.parse(request.header["cookie"]);
            }
            return request;
        }
        type: Kanro.Executors.ExecutorType.RequestHandler = Kanro.Executors.ExecutorType.RequestHandler;
        name: string = "CookieParser";

        constructor(config: Kanro.Containers.IRequestHandlerContainer) {
            super(config);
        }
    }

    export class KanroCookieModule implements Kanro.Core.IModule {
        dependencies: Kanro.Core.IModuleInfo[];

        executorInfos: { [name: string]: Kanro.Executors.IExecutorInfo; };
        async getExecutor(config: Kanro.Containers.IRequestHandlerContainer): Promise<Kanro.Executors.IExecutor> {
            if (config.name == "CookieParser") {
                return new CookieParser(<any>config);
            }
            return undefined;
        }

        public constructor() {
            this.executorInfos = { CookieParser: { type: Kanro.Executors.ExecutorType.RequestHandler, name: "CookieParser" } };
        }
    }
}

export let KanroModule = new Cookie.KanroCookieModule(); 