//include namespace.js Vector.js
MYNS.kbtit931.Point_charge=function(){
    "use strict";
    var setting=function(arr){
	var position,charge;
	if(Object.prototype.toString.call(arr[0])!=='[object Array]')position=false;
	else{
	    var len=arr[0].length,propo=true;
	    position=new Array(len);
	    for(var i=len;i--;){
		position[i]=Number(arr[0][i]);
		propo=propo&&MYNS.kbtit931.Vector.isNum(arr[0][i]);
	    }
	    if(propo===false)position=false;
	}
	if(MYNS.kbtit931.Vector.isNum(arr[1]))charge=arr[1];
	else charge=false;
	return [position,charge];
    };
    var pos_char=setting(Array.prototype.slice.call(arguments)),position=pos_char[0],charge=pos_char[1],dim=position===false?false:position.length;
    this.position=function(){
	if(position===false)return false;
	else return position.concat();
    };
    this.dim=function(){
	var tmp=dim;
	return tmp;
    };
    this.charge=function(){
	var tmp=charge;
	return tmp;
    };
    this.set=function(){
	var pos_char=setting(Array.prototype.slice.call(arguments));
	position=pos_char[0];
	charge=pos_char[1];
	dim=position===false?false:position.length;
	return this;
    };
};
MYNS.kbtit931.Point_charge.prototype={
    e_con:8.854e-12,
    electrostatic_force_r:function(posi){
	if(posi instanceof MYNS.kbtit931.Vector)var vec=posi;
	else var vec=new MYNS.kbtit931.Vector(posi);
	var dim=this.dim();
	if(dim!==vec.dim()||dim===false)return false;
	e_vec=new MYNS.kbtit931.Vector(this.position());
	var dif=e_vec.add(vec.scal(-1)),len=dif.len(),norm=dif.norm();
	if(len===0)return false;
	return norm.scal(-this.charge()/Math.pow(len,2));
    },
    electrostatic_force:function(posi){
	return this.electrostatic_force_r(posi).scal(1/(4*Math.PI*this.e_con))},
    isPoint_charge:function(){
	return !((this.position==false)||(this.charge==false))
    },
}

