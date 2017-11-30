//include namespace.js
MYNS.kbtit931.Vector=function(){
    "use strict";
    var setting=function(arr){
	if(Object.prototype.toString.call(arr[0]) === '[object Array]'){
	    var len=arr[0].length, propo=true,vec=new Array(len),dim=len;
	    for(;len--;){
		propo=propo&&MYNS.kbtit931.Vector.isNum(arr[0][len]);
		vec[len]=Number(arr[0][len]);
	    }
	    if(!propo){
		vec=false;
		dim=false;
	    }
	}
	else{
	    var len=arr.length,propo=true,vec=new Array(len),dim=len;
	    for(;len--;){
		propo=propo&&MYNS.kbtit931.Vector.isNum(arr[len]);
		vec[len]=Number(arr[len]);
	    }
	    if(!propo){
		vec=false;
		dim=false;
	    }
	}
	return [vec,dim];
    };
    var vec_dim=setting(Array.prototype.slice.call(arguments));
    var vec=vec_dim[0],dim=vec_dim[1];
    this.vec=function(){
	if(vec===false)return false;
	else return vec.concat();
    };
    this.dim=function(){
	var tmp=dim;
	return tmp;
    };
    this.set=function(){
	var vec_dim=setting(Array.prototype.slice.call(arguments));
	vec=vec_dim[0];
	dim=vec_dim[1];
	return this;
    };
};

MYNS.kbtit931.Vector.prototype={
    vec:function(){return false},
    dim:function(){return false},
    isVector:function(){return this.vec()!==false&&this.dim()!==false&&this instanceof MYNS.kbtit931.Vector},
    norm:function(){
	if(!this.isVector())return false;
	return new MYNS.kbtit931.Vector(MYNS.kbtit931.Vector.norm(this.vec()));
    },
    len:function(){
	if(!this.isVector())return false;
	var len=0;
	for(var i=this.vec().length;i--;)len+=Math.pow(this.vec()[i],2);
	return Math.sqrt(len);
    },
    add:function(){
	if(!this.isVector())return false;
	var len=arguments.length,dim=this.dim();
	for(var i=len;i--;)if((!(arguments[i] instanceof MYNS.kbtit931.Vector))||arguments[i].vec()===false||dim!==arguments[i].dim())return false;;
	var result_vec=this.vec();
	for(var i=len;i--;)result_vec=MYNS.kbtit931.Vector.add(result_vec,arguments[i].vec());
	return new MYNS.kbtit931.Vector(result_vec);
    },
    inner_p:function(){
	if(!this.isVector())return false;
	var dim=this.dim(),v=this.vec();
	if(arguments.length!=1||(!(arguments[0] instanceof MYNS.kbtit931.Vector))||arguments[0].vec()===false||dim!==arguments[0].dim())return false;
	var result=0,u=arguments[0].vec();
	for(var i=dim;i--;)result+=v[i]*u[i];
	return result;
	
    },
    outer_p:function(){
	if(!this.isVector())return false;
	var dim=this.dim(),v=this.vec();
	if(dim>3||arguments.length!=1||!(arguments[0] instanceof MYNS.kbtit931.Vector)||dim!=arguments[0].dim())return false;
	var u=arguments[0].vec();
	for(var i=dim;i<3;i++){
	    v.push(0);
	    u.push(0);
	}
	return new MYNS.kbtit931.Vector([v[1]*u[2]-v[2]*u[1],v[2]*u[0]-v[0]*u[2],v[0]*u[1]-v[1]*u[0]]);
    },
    scal:function(k){
	if(!this.isVector()||!MYNS.kbtit931.Vector.isNum(k))return false;
	var result=this.vec();
	for(var i=result.length;i--;)result[i]=k*result[i];
	return new MYNS.kbtit931.Vector(result);
    },
    rot:function(u){
	var inner=this.inner_p(u),v_len=this.len(),u_len=u.len();
	if(inner===false||v_len===0||u_len===0)return false;
	return Math.acos(inner/(v_len*u_len));
    },
    rot_d:function(u){
	//�����v���𐳂Ƃ��Ď��g�̃x�N�g����������̃x�N�g�����������̊p�x��Ԃ��܂��B
	var rot=this.rot(u),outer=this.outer_p(u).vec();
	if(outer===false||rot===false||this.dim()>2)return false;
	if(outer[2]<0)return 2*Math.PI-rot;
	else return rot;
    },
};

MYNS.kbtit931.Vector.isNum=function(x){
    "use strict";
    /*
      ���͒l�������ǂ������ʂ��܂��B
      �L���̒l�łȂ����false��Ԃ��A�L���̒l�Ȃ�true��Ԃ��܂��B
      ������Ƃ��Ă̐�����true���Ԃ���܂��B
    */
    if(isNaN(x)==true)return false;
    if(x===true||x===false||x===null||x===""||typeof x==="undefined")return false;
    return isFinite(x);
};
MYNS.kbtit931.Vector.norm=function(){
    "use strict";
    /*
      ���K�����ꂽ�x�N�g�����v�Z���܂��B
      ���͂́A�e�x�N�g����1�����z��ɂ��ē��͂��Ă��������B�������͂��邱�Ƃ��ł��܂��B
      �s���Ȓl�̓������x�N�g����false��Ԃ��A������0�̃x�N�g���͂��̂܂�0�x�N�g����Ԃ��A���ʂ̃x�N�g���͐��K�����ꂽ�x�N�g����Ԃ��܂��B
      ���͂�1�Ȃ�1�����z��ɂ����x�N�g����Ԃ��A���͂������Ȃ�P�����z��ɂ����x�N�g��(�s���ȃx�N�g���Ȃ�false������)�̑g��z��ɂ��ĕԂ��܂��B
    */
    var vec_num=arguments.length;
    if(vec_num==0)return false;
    for(var i=vec_num;i--;)if(Object.prototype.toString.call(arguments[i]) !== '[object Array]')return false;;
    var result_vec=new Array(vec_num);
    for(var j=vec_num;j--;){
	var len=arguments[j].length,vec_len=0,propo=true;
	for(var i=len;i--;){
	    vec_len+=Math.pow(arguments[j][i],2);
	    propo=propo&&MYNS.kbtit931.Vector.isNum(arguments[j][i]);
	}
	vec_len=Math.sqrt(vec_len);
	if(!propo){
	    if(vec_num==1)result_vec=false;
	    else result_vec[j]=false;
	}else{
	    if(!vec_len){
		if(vec_num==1)result_vec=arguments[j];
		else result_vec[j]=arguments[j];
	    }else{
		if(vec_num!=1)result_vec[j]=new Array(len);
		for(;len--;){
		    if(vec_num==1)result_vec[len]=arguments[j][len]/vec_len;
		    else result_vec[j][len]=arguments[j][len]/vec_len;
		}
	    }
	}
    }
    return result_vec
};
MYNS.kbtit931.Vector.add=function(){
    "use strict";
    /*
      ���͂��ꂽ�x�N�g���̘a���v�Z���܂��B�x�N�g����1�����z��œ��͂��A������ł����͂ł��܂��B
      �s���ȃx�N�g���A�x�N�g���̘a����`����Ȃ��x�N�g���̑g�̏ꍇ��false���Ԃ���܂��B
      �v�Z���ʂ̃x�N�g����1�����z��Ƃ��ĕԂ��܂��B
    */
    var vec_num=arguments.length;
    if(vec_num==0)return false;
    for(var i=vec_num;i--;)if(Object.prototype.toString.call(arguments[i]) !== '[object Array]')return false;;
    var len=arguments[0].length;
    for(var i=vec_num;--i;)if(len!=arguments[i].length)return false;;
    var result_vec=new Array(len),propo=true;
    for(;len--;){
	result_vec[len]=0;
	for(var i=vec_num;i--;){
	    result_vec[len]+=arguments[i][len];
	    propo=propo&&MYNS.kbtit931.Vector.isNum(arguments[i][len]);
	}
    }
    if(!propo)return false;
    return result_vec;
};
