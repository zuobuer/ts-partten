// 方式二
class SingletonA {

    // 静态属性类似于闭包中的变量，会在这个类中持续保存
    private static instance: SingletonA;
    
    constructor(){

    }

    static getInstance() {
        if(this.instance === null){
            this.instance = new SingletonA()
        }
        return this.instance;
    }


}

let a = SingletonA.getInstance();
let b = SingletonA.getInstance();

console.log(a === b);



///// 方式一
class SingletonB {
    private static instance: SingletonB;
    constructor(private name: string){
        if(!SingletonB.instance){
            // 初始化操作
            SingletonB.instance = this;
        }
        return SingletonB.instance
    }
}

let c = new SingletonB("hello");
let d = new SingletonB("world");

console.log(c === d);