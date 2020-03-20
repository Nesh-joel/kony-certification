define({ 

  onNavigate : function(id){
    this.getProducts(id);//get the products for category
  },

  getProducts : function(id){
    try{
      serviceName = "bestBuyService";
      integrationObj = KNYMobileFabric.getIntegrationService(serviceName);
      operationName =  "getProducts";
      data= {"productId": id};
      headers= {};
      integrationObj.invokeOperation(operationName, headers, data, this.getProductsSuccess.bind(this), this.getProductsFailure.bind(this));
    }
    catch(exception){
      kony.print(exception);
    }
  },
  getProductsSuccess : function(res){
    //code for success call back
    try{
      var productArray = [],salePrice,avgRating,newItem,flxnewItem;
      var response = res.products;
      for(var i=0;i<response.length;i++){
        if(response[i].new === "true"){
           response[i].newItem = {
            "text":"!!! NEW ITEM !!!",
            "skin":"sknlblBG000000F140ff321b"
          };
           response[i].flxnewItem = {
            "skin":"sknflxBGffff87"
          };
        }
        if(response[i].onSale === "true"){
          response[i].salePrice = {
            "text": response[i].salePrice,
            "skin":"sknlblBG000000F140ff5b5b"
          };
        }
        else{
          response[i].salePrice = {
            "text": response[i].regularPrice,
            "skin":"sknlblF000000140"
          };
        }
        if(response[i].customerReviewAverage !== undefined || response[i].customerReviewAverage !== null || response[i].customerReviewAverage !== ""){
          avgRating = response[i].customerReviewAverage;
        }
        else{
          avgRating = "";
        }
        productArray.push({"imgProduct":response[i].thumbnailImage,"lblProductName":response[i].name,"lblProductPrice":response[i].salePrice,"lblProductRating": avgRating});
      }
      this.view.segProducts.setData(productArray);
    }
    catch(exception){
      kony.print(exception);
    }
  },
  getProductsFailure : function(res){
    //code for failure call back
    kony.print(res);
  }
});