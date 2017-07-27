window.onload = function () {
//封装获取ID的函数
var getDOM = function(id){
    return document.getElementById(id);
};
//封装事件函数
var addEvent = function(id, event, fn){
var el = getDOM(id) || document;
if(el.addEventListener){
    el.addEventListener(event, fn, false);
}else{
    el.attachEvent('on'+event, fn);
}
};
//getElementsByClassName属性兼容IE浏览器
if(!document.getElementsByClassName){
    document.getElementsByClassName = function(cls){
        var ret=[];
        var els=document.getElementsByTagName('*');//取出文档中的所有元素
        for(var i=0;i<els.length;i++){
            //如果 className与要取的相同，那么就放进新的数组中
            if(els[i].className.indexOf(cls + '')>=0 || els[i].className.indexOf('' + cls +'')>=0 || els[i].className.indexOf('' + cls)>=0){
                ret.push(els[i]);
            }
        }
        return ret;
    };
}
//搜索框效果
// 添加个变量用于保存当前选择的Tab，这样当鼠标离开时，选择的也是保存的Tab
var se='tab_1';

addEvent('search-tab','mouseover',function(){
    this.className+=' trigger-hover';//展开列表
});
addEvent('search-tab','mouseout',function(){
    this.className='search-box';
    getDOM(se).className+=' selected';//鼠标移出后点击的选项为被选中状态
});
addEvent('tab_1','mouseover',function(){
    if(getDOM('tab_1').className.indexOf('selected')<0){
    getDOM('tab_1').className+=' selected';//鼠标滑过表示选中状态即背景高亮
 }
});
addEvent('tab_1','mouseout',function(){
    getDOM('tab_1').className='';
    getDOM(se).className+=' selected';//鼠标移出恢复未被选中状态
});
addEvent('tab_2','mouseover',function(){
    if(getDOM('tab_2').className.indexOf('selected')<0){
        getDOM('tab_2').className+=' selected';

    }
});
addEvent('tab_2','mouseout',function(){
    getDOM('tab_2').className='';
    getDOM(se).className+=' selected';
});
addEvent('tab_3','mouseover',function(){
    if(getDOM('tab_3').className.indexOf('selected')<0){
        getDOM('tab_3').className+=' selected';
    }
});
addEvent('tab_3','mouseout',function(){
    getDOM('tab_3').className='';
    getDOM(se).className+=' selected';
});

addEvent('tab_1','click',function(){
    if(getDOM('tab_1').className.indexOf('selected')>=0){
        se='tab_1';
  // getDOM('tab_1').className+='selected';
        getDOM('tab_2').className='';
        getDOM('tab_3').className='';
        getDOM('search-tab').className='search-box';//恢复原有的样式(将列表收起来)
    }
});
addEvent('tab_2','click',function(){
    if(getDOM('tab_2').className.indexOf('selected')>=0){
        se='tab_2';
  // getDOM('tab_2').className+='selected';
        getDOM('tab_1').className='';
        getDOM('tab_3').className='';
        getDOM('search-tab').className='search-box';
    }
});
addEvent('tab_3','click',function(){
    if(getDOM('tab_3').className.indexOf('selected')>=0){
        se='tab_3';
        getDOM('tab_1').className='';
        getDOM('tab_2').className='';
        getDOM('search-tab').className='search-box';
 
    }
});
//input 获得焦点隐藏icon
addEvent('input','focus',function(){
    getDOM('iconfont').style.display='none';
});
addEvent('input','blur',function(){
    getDOM('iconfont').style.display='block';
});

//
//购物车选择商品
//
var table=getDOM('cartTable');//购物车
var selectInputs=document.getElementsByClassName('check');//所有勾选框
var checkAllInputs=document.getElementsByClassName('check-all');// 全选框
var box= getDOM('box');
var allgoods = getDOM('num1');
var choiceTotal=getDOM('choiceTotal'); //已选商品数目容器
var priceTotal = getDOM('priceTotal'); //价格总计
var deleteAll = getDOM('deleteAll'); // 删除全部按钮
var choiceViewList = getDOM('choiceViewList'); //浮层已选商品列表容器
var selected = getDOM('choice'); //已选商品
var subtotal=document.getElementsByClassName('subtotal');
var foot = getDOM('foot');

// 更新总数和总价格，已选浮层
function TotalPrice() { 
        var allprice = 0; //总价
        var nums=0;//商品总数
        var htmlstr=''; 
        $(".one-shop").each(function() { //循环每个店铺 
            var oprice = 0; //店铺总价 
            $(this).find(".check-one").each(function() { //循环店铺里面的商品 
                if ($(this).is(":checked")) { //如果该商品被选中 
                    var num = parseInt($(this).parents(".one-goods").find(".count-input").val()); //得到商品的数量 
                    var price = parseFloat($(this).parents(".one-goods").find(".GoodsPrice").text().substring(1)); //得到商品的单价 
                    var total = (price * num).toFixed(2); //计算单个商品的总价 
                    nums += num;
                    oprice += total; //计算该店铺的总价 
                    htmlstr += '<div><img src="' + $(this).parents(".one-shop").find("#oimg").attr("src") + '"><span class="del">取消选择</span></div>';//显示浮层
                } 
                $(this).closest(".one-shop").find(".subtotal").text(total); //显示被选中商品的总价 
            });
            var oneprice = parseFloat(oprice); //得到每个店铺的总价 
            allprice += oneprice; //计算所有店铺的总价 
        });
        $("#choiceTotal").text(nums);
        $("#priceTotal").text(allprice.toFixed(2)); //输出全部总价 
        $("#choiceViewList").html(htmlstr);

        if(selected == 0){
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
                 TotalPrice();
            }
            if (this.checked==false) { //只要有一个未勾选，则取消全选框的选中状态
                for(var i=0;i<checkAllInputs.length;i++){
                    checkAllInputs[i].checked = false;   
                }
                TotalPrice();
                
            }
            $(this).parents(".one-shop").find(".ShopCheck").prop('checked', true); 
            if ($(".ShopCheck").length == $(".ShopCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量 
                $(".check-all").prop('checked', true); //全选按钮被选中 
                TotalPrice();
                
            }else { 
                $(".check-all").prop('checked', false);
                TotalPrice();
            }
            var goods = $(this).closest(".box").find(".check"); //获取本店铺的所有商品 
            var goodsC = $(this).closest(".box").find(".check:checked"); //获取本店铺所有被选中的商品 
            if(goods.length != goodsC.length){//如果选中的商品不等于所有商品
                $(this).parents(".one-shop").find(".ShopCheck").prop('checked', false); //店铺全选按钮不被选中 
                $(".check-all").prop('checked', false); //全选按钮也不被选中 
                TotalPrice();
            }
        };
        TotalPrice();//选完更新总计
    }
  
    // 点击店铺按钮
    $(".ShopCheck").change(function() { 
    if ($(this).prop("checked") == true) { //如果店铺按钮被选中 
        $(this).parents(".one-shop").find(".check-one").prop('checked', true); //店铺内的所有商品按钮也被选中 
        if ($(".ShopCheck").length == $(".ShopCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量 
            $(".check-all").prop('checked', true); //全选按钮被选中 
            TotalPrice();
             
        } else { 
            $(".check-all").prop('checked', false); //else全选按钮不被选中 
            TotalPrice();         
        } 
    } else if($(this).prop("checked") == false){ //如果店铺按钮不被选中 
        $(this).parents(".one-shop").find(".check-one").prop('checked', false); //店铺内的所有商品也不被全选 
        $(".check-all").prop('checked', false); //全选按钮也不被选中 
        TotalPrice();        
    }
    }); 

    // 显示已选商品弹层
    selected.onclick=function(){
        if(foot.className == 'foot'){
            if(choiceTotal.innerHTML != 0){
                foot.className = 'foot show';
            }
        }else{
            foot.className = 'foot';
        }   
    };
    

    // 已选商品弹层中的取消选择按钮
    // choiceViewList.onclick=function(){
    //     for(var i=0;i<$('.del').length;i++){
    //         if ($('.del').prop('click', true)) {
    //             var index=this.index;
                
    //         }
    //     }  
    // };
    
    // 显示已选商品弹层
    selected.onclick = function () {
        if (choiceTotal.innerHTML != 0) {
            foot.className = (foot.className == 'foot' ? 'foot show' : 'foot');
        }
    };
    
    // 数量减 
    $(".reduce").click(function() { 
        var t = $(this).parent().find('.count-input'); 
        t.val(parseInt(t.val()) - 1); 
        if (t.val() <= 1) { 
            t.val(1); 
            r = $(this).parent().find('.reduce');
            r.text(''); 
        } 
        TotalPrice();
        
    }); 
    // 数量加 
    $(".add").click(function() { 
        var t = $(this).parent().find('.count-input'); 
        t.val(parseInt(t.val()) + 1);
        r = $(this).parent().find('.reduce');
        r.text('-'); 
        if (t.val() <= 1) { 
            t.val(1); 
        } 
        TotalPrice();
        
    }); 
    //单项删除
    $(".delete").click(function() { 
        var conf = confirm('确定要删除吗？');
        if ($(this).parents(".one-shop").find(".box").length == 1) {
            var de = $(this).parents(".one-shop").remove('.one-shop'); 
            TotalPrice();
        }
        else{
            var dete = $(this).parents(".box").remove('.box');
            TotalPrice();
        }
    }); 
    //多项删除
    var oneShop=document.getElementsByClassName('one-shop');
    deleteAll.onclick = function(){
        if(choiceTotal.innerHTML != 0){
            var conf = confirm('确定删除所有商品吗？');
            if(conf){
                for(i=0;i<oneShop.length;i++){
                    if(selectInputs[i].checked){
                        oneShop[i].parentNode.removeChild(oneShop[i]);
                        i--;//回退下标位置
                        
                    }
                }
                $(".check-all").prop('checked', false);
            }
        }else{
            alert('请选择商品');
        }
        TotalPrice();//更新总数
    };
    



































};