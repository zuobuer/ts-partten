// 发布订阅模式
// 三个要素，以UI交互为例
// 1、用户只需要操作UI就可以发送各种个样的事件，因此要有一个通用的事件发布器即发布者
// 2、各种事件需要通过一个管道发送给订阅了该时间的订阅者
// 3、订阅者需要手动的订阅一个事件，但是不是必须的
// 4、发布者只负责emit，而订阅者只负责on

abstract class Publisher {
    abstract emit: (type: string, ...args) => void;
}

class EventPublisher implements Publisher {

    constructor(private channel: Channel) { }

    emit(type: string, ...args): void {
        this.channel.emit(type, ...args);
    }

}

interface EventItem {
    token: number;
    handler: (...args) => void;
}

// 不同的事件类型，可以存放多个事件处理函数
class Channel {
    private channels: {
        [type: string]: Array<EventItem>;
    }

    constructor() {
        this.channels = {};
    }

    getChannels(): {
        [type: string]: Array<EventItem>;
    } {
        return this.channels;
    }

    // 添加事件池
    on(type: string, handler: (...args) => void): Unscriber {
        if (!this.channels[type]) {
            this.channels[type] = [];
        }
        let token = this.channels[type].length;
        this.channels[type].push({
            token: token,
            handler: handler,
        });
        return new Unscriber(this, type, handler)
    }

    // 发送事件
    emit(type: string, ...args) {
        this.channels[type].forEach((item: EventItem) => {
            item.handler(...args)
        })
    }

    off(type: string, handler: (...args) => void): boolean {
        if (!this.channels[type]) {
            return false;
        }

        for (let i = 0, l = this.channels[type].length; i < l; ++i) {
            if (this.channels[type][i].handler === handler) {
                this.channels[type].splice(i, 1);
                break;
            }
        }

        return true;
    }
}

class Unscriber {
    constructor(private channel: Channel, private type: string, private handler: (...args) => void) { }

    unscribe() {
        this.channel.off(this.type, this.handler);
    }
}

class Subcriber {

    constructor(private channel: Channel) { }

    on(type: string, handler: (...args) => void): Unscriber {
        return this.channel.on(type, handler)
    }

}

const channel = new Channel();
const eventPublisher = new EventPublisher(channel);
const eventSubscriber = new Subcriber(channel);

let subscribe = eventSubscriber.on("click", (...args) => {
    console.log("click")
})
console.log(channel.getChannels())
eventPublisher.emit("click", { data: "hello world" }, { data: "hello typescript" });
subscribe.unscribe();
console.log(channel.getChannels())
eventPublisher.emit("click", { data: "hello world" }, { data: "hello typescript" });
subscribe = eventSubscriber.on("click", (...args) => {
    console.log("click")
})
console.log(channel.getChannels())
eventPublisher.emit("click", { data: "hello world" }, { data: "hello typescript" });