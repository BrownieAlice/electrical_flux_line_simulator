var anime=function(){
    "use strict";
    anime.set_wh();
    var dt=1;
    var canvas=document.getElementById("loop");
    if(!canvas||!canvas.getContext)return false;
    var ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var pack=MYNS.kbtit931;
    var table=document.getElementById("p_c_t");
    var num_p=table.childElementCount;
    var f=new pack.Electrostatic_field();
    for(var i=1;i<num_p;i++){
	var point=table.childNodes[i].id;
	var num=Number(point.substr(0,point.length-1).substr(3));
	var data={}
	var name=anime.p_name
	for(var j=0,max=name.length;j<max;j++){
	    data[name[j]]=document.getElementById(name[j]+"["+num+"]").value;
	    if(MYNS.kbtit931.Vector.isNum(data[name[j]]))data[name[j]]=Number(data[name[j]]);
	    else data[name[j]]=false;
	}
	if(data.x<0||data.x>canvas.width)data.x=false;
	if(data.y<0||data.y>canvas.height)data.y=false;
	if(data.Q==0)data.Q=false;
	if(data.x===false||data.y===false||data.Q===false){
	    for(var j=0,max=name.length;j<max;j++){
		document.getElementById(name[j]+"["+num+"]").value="";
	    }
	}else{
	    var p=new pack.Point_charge([data.x,data.y],data.Q);
	    f.push(p);
	}
    }
    var points=f.points(),c_max=0;
    for(var i=points.length;i--;){
	f.point_prop[i].in_count=0;
	f.point_prop[i].in_theta=new Array(0);	
	var c=Math.abs(points[i].charge());
	if(c>c_max)c_max=c;
    }
    var c_per_num=c_max/18;
    var points_p_list=new Array(0);
    var base1=new pack.Vector([1,0]);
    for(var i=points.length;i--;)if(points[i].charge()>0)points_p_list.push(i);;
    //計算
    for(var i=points_p_list.length;i--;){
	var num=Math.floor(points[points_p_list[i]].charge()/c_per_num)+1;
	var p_posi=points[points_p_list[i]].position();
	for(var j=0;j<num;j++){
	    ctx.beginPath();
	   var  start=[p_posi[0]+Math.cos(2*Math.PI/num*j),p_posi[1]+Math.sin(2*Math.PI/num*j)]
	    ctx.moveTo(start[0],start[1]);
	    var vec=new pack.Vector(start[0],start[1]),c=0,tmp_vec,near_m=0,f_vec;
	    do{
		tmp_vec=vec;
		f_vec=f.electrostatic_force_r(vec).norm();
		vec=vec.add(f_vec.scal(dt));
		var tmp=vec.vec();
		if(tmp===false||tmp[0]<0||canvas.width<tmp[0]||tmp[1]<0||canvas.height<tmp[1]||(f_vec.vec()[0]==0&&f_vec.vec()[1]==0))break;
		if(c<=4){
		    var near=f.near(vec,dt*4);
		    var near_m=0;
		    for(var k=near.length;k--;)if(points[near[k]].charge()<0)near_m++;;
		    var dis=f.dis(vec);
		    c=(dis<=0||dis===false)?-1:Math.floor(dis/dt);
		}
		ctx.lineTo(tmp[0],tmp[1]);
	    }while(c--!=-1&&near_m===0);
	    ctx.stroke();
	    if(near_m!==0){
		for(var l=near.length;l--;){
		    f.point_prop[near[l]].in_count++;
		    f.point_prop[near[l]].in_theta.push(base1.rot_d(f.electrostatic_force_r(tmp_vec)));
		}
	    }
	}
    }
    for(var i=points.length;i--;){
	var po_c_i=points[i].charge();
	var max=Math.floor(Math.abs(po_c_i)/c_per_num);
	var prop=f.point_prop[i];
	if(po_c_i<0&&prop.in_count<max){
	    while(prop.in_count<max){
		if(prop.in_count===0)var theta3=0;
		if(prop.in_count===1){
		    var theta3=Math.PI+prop.in_theta[0];
		}else{
		    var dif=0,theta1,theta2,thrta3
		    var j=0;
		    for(var j=0,j_max=prop.in_theta.length;j<j_max;j++){
			var tmp_dif=2*Math.PI
			for(var k=0,k_max=j_max;k<k_max;k++){
			    var tmp_d=prop.in_theta[k]-prop.in_theta[j];
			    if(tmp_d<=0)tmp_d=2*Math.PI+tmp_d;
			    if(tmp_d<=tmp_dif&&j!=k){
				tmp_dif=tmp_d;
				theta1=prop.in_theta[k];
				theta2=prop.in_theta[j];
			    }
			}
			if(dif<tmp_dif){
			    dif=tmp_dif;
			    theta3=theta2+dif/2;
			}
		    }
		}
		while(theta3>2*Math.PI)theta3-=2*Math.PI;
		prop.in_theta.push(theta3);
		var now_point=points[i];
		var start_loc=now_point.position();
		var start=new Array(2);
		ctx.beginPath();
		start[0]=start_loc[0]+Math.cos(theta3+Math.PI)*dt*3;
		start[1]=start_loc[1]+Math.sin(theta3+Math.PI)*dt*3;
		ctx.moveTo(start[0],start[1]);
		var vec=new pack.Vector(start[0],start[1]),c=0;
		do{
		    f_vec=f.electrostatic_force_r(vec).norm();
		    vec=vec.add(f_vec.scal(-dt)); 
		    var tmp=vec.vec();
		    if(tmp===false||tmp[0]<0||canvas.width<tmp[0]||tmp[1]<0||canvas.height<tmp[1]||(f_vec.vec()[0]==0&&f_vec.vec()[1]))break;
		    if(c<=2){
			var near=f.near(vec,dt*3);
			var near_m=0;
			for(var k=near.length;k--;)if(points[near[k]].charge()>0)near_m++;;
			var dis=f.dis(vec);
			c=(dis<=0||dis===false)?-1:Math.floor(f.dis(vec)/dt);
		    }
		    ctx.lineTo(tmp[0],tmp[1]);
		}while(c!=-1&&((4<c--)||near_m===0));
		ctx.stroke();
		
		prop.in_count++;
	    }
	}
    }
    
    //計算終了
    var min_p=Infinity;
    for(var i=points.length;i--;){
	var ch_p=Math.abs(points[i].charge());
	min_p=(min_p>ch_p&&ch_p!=0)?ch_p:min_p;
    }
    for(var i=points.length;i--;){
	var loc=points[i].position();
	var charge_p=points[i].charge();
	ctx.beginPath();
	ctx.arc(loc[0],loc[1],5*Math.sqrt(Math.abs(charge_p)/min_p),0,Math.PI*2,false);

	if(charge_p>0)ctx.fillStyle="rgb(250,226,225)";
	else if(charge_p<0) ctx.fillStyle="rgb(211,237,251)";
	ctx.fill();
	ctx.stroke();
    }
    ctx.fillStyle="black";
 
    
};
anime.set=function(){
    "use strict";
    var context=document.getElementById("loop");
    var table=document.createElement("table");
    var form=document.createElement("form");
    form.id="w_h";
    var set=anime.set_name;
    var tr=[];
    tr[1]=document.createElement("tr");
    for(var i=set.length;i--;){
	var th=document.createElement("th").appendChild(document.createTextNode(set[i])).parentNode;
	th.width=80;
	tr[1].appendChild(th);
    }
    tr[1].appendChild(document.createElement("th"));
    tr[1].appendChild(document.createElement("th"));
    tr[2]=document.createElement("tr");
    for(var i=set.length;i--;){
	var input=document.createElement("input");
	input.type="text";
	input.id="input_"+set[i];
	input.size=5;
	tr[2].appendChild(document.createElement("th").appendChild(input).parentNode)
    }
    var button=document.createElement("button");
    button.type="button";
    button.appendChild(document.createTextNode("set"));
    button.addEventListener("click",function(){anime.set_wh();},false);
    tr[2].appendChild(document.createElement("th").appendChild(button).parentNode)

    var p_draw=document.createElement("button");
    p_draw.type="button";
    p_draw.appendChild(document.createTextNode("draw"));
    p_draw.addEventListener("click",function(){anime();},false);
    tr[2].appendChild(document.createElement("th").appendChild(p_draw).parentNode);

    for(var i=1;i<=2;i++){
	var space_th=document.createElement("th");
	space_th.width=500;
	tr[i].appendChild(space_th);
    }
    
    for(var i=0,max=anime.p_name.length;i<max;i++){
	tr[1].appendChild(document.createElement("th").appendChild(document.createTextNode(anime.p_name[i])).parentNode);
    }

    for(var i=0,max=anime.p_name.length;i<max;i++){
	var input=document.createElement("input");
	input.type="text";
	input.id="mouse_"+anime.p_name[i];
	input.size=5;
	tr[2].appendChild(document.createElement("th").appendChild(input).parentNode)
    }

    var button=document.createElement("button");
    button.type="button";
    button.appendChild(document.createTextNode("set"));
    button.addEventListener("click",function(){anime.click_setting();},false);
    tr[2].appendChild(document.createElement("th").appendChild(button).parentNode)
    
    table.appendChild(tr[1]);
    table.appendChild(tr[2]);
    form.appendChild(table);
    context.parentNode.insertBefore(form,context);
    anime.set_wh();

    var table_p=document.createElement("table");
    table_p.id="p_c_t";
    table_p.title=0;
    var form_p=document.createElement("form");
    form_p.id="point_charge";
    var tr_p=[];
    tr_p[1]=document.createElement("tr");
    var p_set=anime.p_name
    for(var i=0,max=p_set.length;i<max;i++){
	var th_p=document.createElement("th").appendChild(document.createTextNode(p_set[i])).parentNode;
	th_p.width=80;
	tr_p[1].appendChild(th_p);
    }
    var p_add=document.createElement("button");
    p_add.type="button";
    p_add.appendChild(document.createTextNode("add"));
    p_add.addEventListener("click",function(){anime.add();},false);
    tr_p[1].appendChild(document.createElement("th").appendChild(p_add).parentNode);
    
    table_p.appendChild(tr_p[1]);
    form_p.appendChild(table_p);
    context.parentNode.insertBefore(form_p,context);
    anime.add(0);
};
anime.set_wh=function(){
    "use strict";
    var set={},name=anime.set_name;
    var context=document.getElementById("loop");
    for(var i=name.length;i--;){
	set[name[i]]=document.getElementById("input_"+name[i]).value;
	if(MYNS.kbtit931.Vector.isNum(set[name[i]]))context[name[i]]=Number(set[name[i]]);
	document.getElementById("input_"+name[i]).value=context[name[i]];
    }
};
anime.set_name=["height","width"];
anime.p_name=["x","y","Q"];
anime.add=function(){
    "use strict";
    var table=document.getElementById("p_c_t"),name=anime.p_name;
    var tmp=table.title++
    var tr=document.createElement("tr");
    tr.id="tr"+"["+tmp+"]";
    for(var i=0,max=name.length;i<max;i++){
	var input=document.createElement("input");
	input.type="text";
	input.id=name[i]+"["+(tmp)+"]";
	input.size=5;
	tr.appendChild(document.createElement("th").appendChild(input).parentNode);
    }
	var button=document.createElement("button");
	button.type="button";
	button.appendChild(document.createTextNode("del"));
	button.addEventListener("click",function(){anime.del(tmp);},false);
	tr.appendChild(document.createElement("th").appendChild(button).parentNode)
    
    table.appendChild(tr);
};
anime.del=function(i){
    "use strict";
    tr=document.getElementById("tr["+i+"]");
    tr.parentNode.removeChild(tr);
};
anime.canvas_click=function(evt){
    "use strict";
    document.getElementById("mouse_x").value=evt.offsetX;
    document.getElementById("mouse_y").value=evt.offsetY;
};
anime.click_set=function(){
    "use stricy";
    var canvas=document.getElementById("loop");
    var set={};
    for(var i=0,max=anime.p_name.length;i<max;i++){
	var str=anime.p_name[i];
	set[str]=document.getElementById("mouse_"+str);
	if(MYNS.kbtit931.Vector.isNum(set[str]))set[str]=Number(set[str]);
	else set[str]=false;
    }
    if(set.x<0||canvas.width<set.x)set.x=false;
    if(set.y<0||canvas.height<set.y)set.y=false;
    if(set.Q==0)set.Q=false;
    if(set.x!==false&&set.y!==false&&set.Q!==false){
	anime.add();
	document.getElementById("p_c_t"),name=anime.p_name;
    var tmp=table.title++
    var tr=document.createElement("tr");
    tr.id="tr"+"["+tmp+"]";
    for(var i=0,max=name.length;i<max;i++){
	var input=document.createElement("input");
	input.type="text";
	input.id=name[i]+"["+(tmp)+"]";
	input.size=5;
	tr.appendChild(document.createElement("th").appendChild(input).parentNode);
    }
    if(tmp>0){
	button=document.createElement("button");
	button.type="button";
	button.appendChild(document.createTextNode("del"));
	button.addEventListener("click",function(){anime.del(tmp);},false);
	tr.appendChild(document.createElement("th").appendChild(button).parentNode)
    }
    
    table.appendChild(tr);
    }
};
anime.del=function(i){
    "use strict";
    var tr=document.getElementById("tr["+i+"]");
    tr.parentNode.removeChild(tr);
};
anime.canvas_click=function(evt){
    "use strict";
    document.getElementById("mouse_x").value=evt.offsetX;
    document.getElementById("mouse_y").value=evt.offsetY;
    document.getElementById("mouse_Q").value="";
};
anime.click_setting=function(){
    "use strict";
    var canvas=document.getElementById("loop");
    var set={};
    for(var i=0,max=anime.p_name.length;i<max;i++){
	var str=anime.p_name[i];
	set[str]=document.getElementById("mouse_"+str).value;
	if(MYNS.kbtit931.Vector.isNum(set[str]))set[str]=Number(set[str]);
	else set[str]=false;
    }
    if(set.x<0||canvas.width<set.x)set.x=false;
    if(set.y<0||canvas.height<set.y)set.y=false;
    if(set.Q==0)set.Q=false;
    if(set.x!==false&&set.y!==false&&set.Q!==false){
	anime.add();
	var num=document.getElementById("p_c_t").title-1;
	for(var i=0,max=anime.p_name.length;i<max;i++){
	    var str=anime.p_name[i];
	    document.getElementById(str+"["+num+"]").value=set[str];
	}
    }
};
