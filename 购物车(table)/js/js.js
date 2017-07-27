window.onload=function(){
	//getElementsByClassName属性兼容IE浏览器
	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function(cls){
			var ret=[];
			var els=document.getElementsByTagName('*');
			for(var i=0;i<els.length;i++){
                if (els[i].className.indexOf(cls + ' ') >=0 || els[i].className.indexOf(' ' + cls + ' ') >=0 || els[i].className.indexOf(' ' + cls) >=0) {
					ret.push(els[i]);
				}
			}
			return ret;
		};
	}
	var table=document.getElementById('cartTable');//购物车表格
	var selectInputs=document.getElementsByClassName('check');//所有勾选框
	var checkAllInputs=document.getElementsByClassName('check-all');// 全选框
	var tr=table.children[1].rows;//获取所有的行tr
	var selectedTotal=document.getElementById('selectedTotal'); //已选商品数目容器
	var priceTotal = document.getElementById('priceTotal'); //价格总计
	var deleteAll = document.getElementById('deleteAll'); // 删除全部按钮
	var selectedViewList = document.getElementById('selectedViewList'); //浮层已选商品列表容器
    var selected = document.getElementById('selected'); //已选商品
    var foot = document.getElementById('foot');

    // 更新总数和总价格，已选浮层
	function getTotal() {
        var seleted = 0;
        var price = 0;
        var HTMLstr = '';
        for (var i = 0, len = tr.length; i < len; i++) {
            if (tr[i].getElementsByTagName('input')[0].checked) {
                tr[i].className = 'on';
                seleted += parseInt(tr[i].getElementsByTagName('input')[1].value);//计算已选商品数目
                price += parseFloat(tr[i].cells[4].innerHTML);//计算总计价格
                // price += parseFloat(tr[i].getElementsByTagName('td')[4].innerHTML); 
                HTMLstr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"><span class="del" index="' + i + '">取消选择</span></div>';// 添加图片到弹出层已选商品列表容器
            }
            else {
                tr[i].className = '';
            }
        }

        selectedTotal.innerHTML = seleted; // 已选数目
        priceTotal.innerHTML = price.toFixed(2);// 总价
        selectedViewList.innerHTML = HTMLstr;

        if (seleted == 0) {
            foot.className = 'foot';
        }
    }


    // 点击选择框
    for(var i = 0; i < selectInputs.length; i++ ){
    	selectInputs[i].onclick = function () {
    		if (this.className.indexOf('check-all') >= 0) { //如果是全选，则吧所有的选择框选中
    			 for (var j = 0; j < selectInputs.length; j++) {
                    selectInputs[j].checked = this.checked;
                 }
             }
    		if (this.checked==false) { //只要有一个未勾选，则取消全选框的选中状态
    			for(var i=0;i<checkAllInputs.length;i++){
    				checkAllInputs[i].checked = false;
    			}
    		}
    		getTotal();//选完更新总计
    	};
    }
       
    // 显示已选商品弹层
    selected.onclick=function(){
    	if(foot.className == 'foot'){
    		if(selectedTotal.innerHTML != 0){
				foot.className = 'foot show';
			}
    	}else{
    		foot.className = 'foot';
    	}	
    };
    // 已选商品弹层中的取消选择按钮
    selectedViewList.onclick=function(e){
    	var e = e || window.event;//兼容IE
    	var el = e.srcElement;//event.srcElement 可以捕获当前事件作用的对象
    	if(el.className=='del'){
    		var input = tr[el.getAttribute('index')].getElementsByTagName('input')[0];//.getAttribute('index')取得自定义属性
    		input.checked=false;
    		input.onclick();//同时取消缩略图和商品总数和总价
    	}
    };
 

    // 显示已选商品弹层
    selected.onclick = function () {
        if (selectedTotal.innerHTML != 0) {
            foot.className = (foot.className == 'foot' ? 'foot show' : 'foot');
        }
    };
    // 
    //为每行元素添加事件
    for(var i=0;i < tr.length; i++){
    	//将点击事件绑定到tr元素
    	tr[i].onclick = function(e){
    		var e = e || window.event;
    		var el = e.target || e.srcElement;//通过事件对象的target属性获取触发元素。兼容firefox和IE
    		var cls = el.className;//触发元素的class
    		var input = this.getElementsByTagName('input')[1];// 数目input
    		var val =parseInt(input.value);//数目
    		var reduce = this.getElementsByTagName('span')[1];
    		//通过判断触发元素的class确定用户点击了哪个元素
    		switch(cls){//更改商品数量
    			case 'add':  //点击了加号
    			input.value = val + 1;
    			reduce.innerHTML = "-";
    			getSubTotal(this);
    			break;
    			case 'reduce':  //点击了减号
    			if(val > 1){
    				input.value = val - 1;
    			}
    			if(input.value <= 1){
    				reduce.innerHTML = '';
    			}
    			getSubTotal(this);
    			break;
    			case 'delete':  //点击了删除
    				var conf = confirm('确定要删除吗？');
    				if(conf){
    					this.parentNode.removeChild(this);
    				}
    				break;
    			default :
                    break;
    		}
    		getTotal();
    	};
    	// 给数目输入框绑定keyup事件
   
    	tr[i].getElementsByTagName('input')[1].onkeyup=function(){
    		var val = parseInt(this.value);
    		var tr = this.parentNode.parentNode; //input的父节点的父节点，及为tr
    		var reduce = tr.getElementsByTagName('span')[1];
    		if(isNaN(val) || val<1){//如果input数值为空或为负则置为一
    			val=1;
    		}
    		this.value=val;
    		if(val<=1){
    			reduce.innerHTML='';
    		}else{
    			redoce.innerHTML='-';
    		}
    		getSubTotal(tr);//更新小计
    		getTotal();//更新总数
    	};
    }

    // 计算单行价格,小计
    function getSubTotal(tr){
    	var tds = tr.cells;//获取到tr下的所有td
    	var price = parseFloat(tds[2].innerHTML);//单价 or： price = cells[2];
    	var count = parseInt(tr.getElementsByTagName('input')[1].value);//数目input
    	var SubTotal = parseFloat(price * count);//相乘
    	tds[4].innerHTML = SubTotal.toFixed(2);//写入HTML

    }

	//多项删除
	deleteAll.onclick = function(){
		if(selectedTotal.innerHTML != 0){
			var conf = confirm('确定删除所选商品吗？');
			if(conf){
				for(i=0;i<tr.length;i++){
                    // 如果被选中，就删除相应的行
					if(tr[i].getElementsByTagName('input')[0].checked){
						tr[i].parentNode.removeChild(tr[i]);// 删除相应节点
						i--;//回退下标位置
					}
				}
			}
		}else{
			alert('请选择商品');
		}
		getTotal();//更新总数
	};

    // 默认全选
	checkAllInputs[0].checked = true;
    checkAllInputs[0].onclick();
};
