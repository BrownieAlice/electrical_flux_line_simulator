// include namespace.js Vector.js Point_charge_js
MYNS.kbtit931.Electrostatic_field=function(){
    "use strict";
    var self=this;
    var setting=function(arr){
	var len=arr.length,points=new Array(0)
	for(var i=0;i<len;i++)if((arr[i] instanceof MYNS.kbtit931.Point_charge)&&arr[i].isPoint_charge()&&arr[0].dim()==arr[i].dim())points.push(arr[i]);;
	return points
    }
    var Flooz=0,points=setting(Array.prototype.slice.call(arguments));
    this.point_prop=new Array(points.length);
    for(var i=this.point_prop.length;i--;)this.point_prop[i]={isFlooz:false,};
    this.Flooz=function(){
	if(Flooz==0){
	    for(var i=points.length;i--;){
		points[i]=new MYNS.kbtit931.Point_charge(points[i].position(),points[i].charge());
		this.point_prop[i].isFlooz=true;
	    }
	    Flooz=1;
	}
	return this
    };
    this.isFlooz=function(){
	return Flooz===0?false:true;
    };
    this.setFlooz=function(){
	Flooz=1;
	return this
    };
    this.deFlooz=function(){
	Flooz=0;
	return this
    };
    this.set=function(){
	Flooz=0;
	points=setting(Array.prototype.slice.call(arguments));
	this.point_prop=new Array(points.length);
	for(var i=this.point_prop.length;i--;)this.point_prop[i]={isFlooz:false,};
	return this;
    };
    this.push=function(){
	var p_push=setting(points.concat(Array.prototype.slice.call(arguments)));
	for(var i=points.length,len=p_push.length;i<len;i++){
	    if(Flooz==1){
		p_push[i]=(new MYNS.kbtit931.Point_charge(p_push[i].position(),p_push[i].charge()));
		self.point_prop[i]={isFlooz:true,};
	    }else self.point_prop[i]={isFlooz:false,};
	}
	points=p_push;
	return this;
    };
    this.num=function(){
	var tmp=points.length;
	return tmp;
    };
    this.points=function(){
	var num=self.num(),tmp=new Array(num);
	for(var i=num;i--;)tmp[i]=new MYNS.kbtit931.Point_charge(points[i].position(),points[i].charge())
	return tmp;
    };
};
MYNS.kbtit931.Electrostatic_field.prototype={
    electrostatic_force_r:function(posi){
	p=this.points();
	if(p===[])return false
	var force=p[0].electrostatic_force_r(posi);
	for(var i=this.num();--i&&force!==false;)force=force.add(p[i].electrostatic_force_r(posi));
	return force;
    },
    electrostatic_force:function(posi){
	p=this.points();
	if(p===[])return false
	var force=p[0].electrostatic_force(posi);
	for(var i=this.num();--i&&force!==false;)force=force.add(p[i].electrostatic_force(posi));
	return force;
    },
    near:function(loc,ran){
	var vec;
	if(loc instanceof MYNS.kbtit931.Vector)vec=loc;
	else vec=new MYNS.kbtit931.Vector(loc);
	points=this.points();
	if(vec.vec()===false||points.length===0||points[0].dim()!==vec.dim()||MYNS.kbtit931.Vector.isNum(ran)===false)return false;
	var u=new MYNS.kbtit931.Vector(),result=new Array(0);
	for(var i=0,max=points.length;i<max;i++)if(vec.add(u.set(points[i].position()).scal(-1)).len()<=Number(ran))result.push(i);;
	return result;
    },
    dis:function(loc){
	var vec;
	if(loc instanceof MYNS.kbtit931.Vector)vec=loc;
	else vec=new MYNS.kbtit931.Vector(loc);
	points=this.points();
	if(vec.vec()===false||points.length===0||points[0].dim()!==vec.dim())return 0;
	var u=new MYNS.kbtit931.Vector(),dis=Infinity;
	for(var i=0,max=points.length;i<max;i++){
	    var d=vec.add(u.set(points[i].position()).scal(-1)).len()
	    if(dis>d)dis=d;
	}
	return dis;
    },
}
