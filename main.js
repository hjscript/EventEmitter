(function(){
	var root=(typeof self=='obejct'&&self.self==self&&self)
	||(typeof global == 'object' && global.global == global && global)||this||{};

	function EventEmitter(){
		this._events={}
	}

	EventEmitter.prototype={
		constructor:EventEmitter,
		isValidListener:function(listener){
			if(typeof listener==='function'){
				return true;
			} else if(listener && typeof listener==='object'){
				return this.isValidListener(listener.listener)
			} else {
				return false;
			}
		},
		indexOf:function(array,item){
			var result = -1;
			item = typeof item =='object' ? item.listener : item;
			for (var i = 0,len=array.length; i <len; i++) {
				if(array[i]==item){
					result=i;
					break;
				}
			}
			return result;
		},
		on:function(eventName, listener){
			if(!eventName||!listener){
				return;
			}
			if(!this.isValidListener(listener)){
				throw new TypeError('listener must be a function');
			}
			var events=this._events;
			console.log('events=>',events[eventName])
			var listeners=events[eventName]=events[eventName]||[];
			console.log('on=>',listeners)
			var listenerIsWrapped = typeof listener === 'object';
			//重复添加事件
			if(this.indexOf(listeners,listener)===-1){
				listeners.push(listenerIsWrapped?listener:{
					listener:listener,
					once:false
				})
			}
			return this;
		},
		once:function(eventName, listener){
			return this.on(eventName,{
				listener:listener,
				once:true
			})
		},
		off:function(eventName,listener){
			var listeners=this._events[eventName],index=0;
			if(!listeners){
				return;
			}
			for (var i = 0,len = listeners.length;i < len; i++) {
				if(listeners[i]&&listeners[i].listener===listener){
					index=i;
					break;
				}
			}
			if(typeof index!== void 0){
				listeners.splice(i,1);
			}
			return this;
		},
		emit:function(eventName,args){
			var listeners=this._events[eventName];
			if(!listeners){
				return;
			}
			for (var i = 0,len = listeners.length;i < len; i++) {
				var listener=listeners[i];
				if(listener){
					listener.listener.apply(this,args||[]);
					if(this.once){
						this.off(eventName,listener.listener)
					}
				}
			}
			return this;
		},
		allOff:function(eventName){
			if(eventName&&this._events[eventName]){
				this._events[eventName]=[]
			}else{
				this._events={}
			}
		}
	}
	
	if (typeof exports != 'undefined' && !exports.nodeType) {
		if (typeof module != 'undefined' && !module.nodeType && module.exports) {
			exports = module.exports = EventEmitter;
		}
		exports.EventEmitter = EventEmitter;
	} else {
		root.EventEmitter = EventEmitter;
	}
})()