/**
 * @export {Observer: 抽象观察者基类}
 * @protected {name: 观察者的唯一表示符}
 * @func update方法类接受主题的通知
 */
export abstract class Observer {
    constructor(protected name) { }
    getName() {
        return this.name;
    }
    abstract update(msg: any);
}
/**
 * @export 观察者列表，每个主题维护一组观察者列表
 * @func add方法，主题主动增加一个观察者
 * @func count方法，当前主题中有多少个观察者
 * @func getIndex方法，获取当前主题中第k个观察者
 * @private {observerList: 私有的观察者列表}
 */
export class ObserverList {
    private observerList: Array<Observer>;

    constructor() {
        this.observerList = [];
    }

    public getIndex(index: number) {
        if (index > this.count()) throw new Error("out of range");
        return this.observerList[index];
    }

    public add(observer: Observer) {
        this.observerList.push(observer)
    }

    public count() {
        return this.observerList.length;
    }
}

/**
 * @export 抽象的主题基类
 * @func addObserver,增加一个观察者的方法
 * @func notify,通知所有的观察者的方法
 * 
 */
export abstract class Subject {
    protected observers: ObserverList = new ObserverList();
    abstract addObserver(observer: Observer);
    abstract notify(msg);
}

/**
 * @class 具体的主题对象
 * @func addObserver具体的添加观察者的方法
 * @func notify具体的通知观察者的方法
 */
class Click extends Subject {

    public addObserver(observer: Observer) {
        this.observers.add(observer);
        return this;
    }

    public notify(msg: any) {
        let length = this.observers.count();
        for (let i = 0; i < length; ++i) {
            this.observers.getIndex(i).update(msg);
        }
        return this;
    }
}


class ObserverTypeOne extends Observer {
    constructor(name) {
        super(name)
    }
    update(msg: any) {
        console.log(this.name + ' say: ' + msg);
        return this;
    }
}

class ObserverTypeTwo extends Observer {
    constructor(name) {
        super(name)
    }
    update(msg: any) {
        console.log(this.name + ' say: ' + msg);
        return this;
    }
}

let ClickEvent: Click = new Click();
let ObserverOne: ObserverTypeOne = new ObserverTypeOne("ObserverTypeOne");
let ObserverTwo: ObserverTypeTwo = new ObserverTypeTwo("ObserverTypeTwo");

ClickEvent
    .addObserver(ObserverOne)
    .notify("hello world")
    .addObserver(ObserverTwo)
    .notify("the second msg")