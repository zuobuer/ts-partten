// 发布订阅模式
// 三个要素，以UI交互为例
// 1、用户只需要操作UI就可以发送各种个样的事件，因此要有一个通用的事件发布器即发布者
// 2、各种事件需要通过一个管道发送给订阅了该时间的订阅者
// 3、订阅者需要手动的订阅一个事件，但是不是必须的
// 4、发布者只负责emit，而订阅者只负责on

// 未全部完成，需要取消订阅

abstract class Publisher {
    abstract emit: (type: string, ...args) => void;
}

class EventPublisher implements Publisher {

    constructor(private channel: Channel) { }

    emit(type: string, ...args): void {
        this.channel.emit(type, ...args);
    }

}

// 不同的事件类型，可以存放多个事件处理函数
class Channel {
    private channels: {
        [type: string]: Array<() => void>;
    }

    constructor() {
        this.channels = {};
    }

    // 添加事件池
    add(type: string, handler: (...args) => void) {
        if (!this.channels[type]) {
            this.channels[type] = [];
        }
        this.channels[type].push(handler);
    }

    // 发送事件
    emit(type: string, ...args) {
        this.channels[type].forEach((handler: (...args)=>void) => {
            handler(...args);
        })
    }
}

class Subcriber {

    constructor(private channel) { }
    
    on(type: string, handler: (...args) => void) {
        this.channel.add(type, handler)
    }

}

const channel = new Channel();
const eventPublisher = new EventPublisher(channel);
const eventSubscriber = new Subcriber(channel);

eventSubscriber.on("click", (...args) => {
    console.log("click")
    console.log(args)
})

eventPublisher.emit("click", {data: "hello world"}, {data: "hello typescript"});