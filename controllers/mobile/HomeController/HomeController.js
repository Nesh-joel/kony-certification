var breadCrumbs = [];
var currentIndex = 0;
define({ 
  onNavigate : function(from){
    if(from === "product"){
      alert(breadCrumbs);
    }
    this.getCategories("cat00000");
    breadCrumbs.push([{"name":"Home"}]);
    this.view.lblBreadcrumbs.text = "Home";
    this.view.segProducts.onRowClick = this.categoriesOnClick;
    this.view.bestBuyHeader.imgBack.onTouchEnd = this.backClick;
  },
  getCategories : function(id){
    try{
      serviceName = "bestBuyService";
      integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      operationName =  "getProductCategories";
      data= {"categoryId": id};
      headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.operationSuccess.bind(this), this.operationFailure.bind(this));
    }
    catch(exception){
      alert(exception);
    }
  },
  operationSuccess : function(res){
    try{
      var response = res.categories[0].subCategories;
      //       alert(response);
      this.view.segProducts.widgetDataMap = {"lblCategoryName":"name"};
      this.view.segProducts.setData(response);
      breadCrumbs[currentIndex].push(this.view.segProducts.data);
      if(currentIndex > 0){
        this.view.imgBack.isVisible = true;
      }
      alert(breadCrumbs);
    }
    catch(exception){
      kony.print(exception);
    }
  },
  operationFailure : function(response){
    alert(response);
  },
  categoriesOnClick : function(){
    try{
      if(this.view.segProducts.selectedRowItems[0].id !== undefined || this.view.segProducts.selectedRowItems[0].id !== null){
        var catId = this.view.segProducts.selectedRowItems[0].id;
        var catName = this.view.segProducts.selectedRowItems[0].name;
        if(currentIndex < 2){
          this.getCategories(catId);
          breadCrumbs.push([{"name":catName}]);
          currentIndex = currentIndex+1;
          this.view.lblBreadcrumbs.text = this.view.lblBreadcrumbs.text +" -> "+ breadCrumbs[currentIndex][0].name;
        }
        else{
          if(catId !== undefined || catId !== null || catId !== ""){
            var navigateToForm = new kony.mvc.Navigation("frmProductList");
            navigateToForm.navigate(catId);
          }
          else{
            alert("There are no products available for this category");
          }
        }
      }
    }
    catch(exception){
      alert(exception);
    }
  },
  backClick : function(){
    alert("back");
    breadCrumbs.splice(currentIndex,1);
    currentIndex = currentIndex-1;
    var header = breadCrumbs[0][0].name;
    for(var i=1;i<breadCrumbs.length;i++){
      header = header +" -> "+ breadCrumbs[i][0].name
    }
    this.view.lblBreadcrumbs.text = header;
    this.view.segProducts.setData(breadCrumbs[currentIndex][1]);
    if(currentIndex === 0){
      this.view.imgBack.isVisible = false;
    }
  },

});