/* eslint-disable react/jsx-no-bind */
import React, { ReactElement, useEffect, useState } from 'react';
import { Table } from '../../base-components/table/Table';
import { SearchBar } from '../../base-components/searchBar/SearchBar';
import { fetchData } from '../../../utility/fetchServerData';
import { parseDatabaseDate } from '../../../utility/parseDate';
import { ProductInSupplyDatabaseRecord, SupplyListDatabaseRecord } from '../../../../tsDataTypes/tsTypesGrocerySupplyOverviewHome';
import './supplyProductDetail.css';


type Props = {
   currentProduct: ProductInSupplyDatabaseRecord | undefined,
   setCurrentProduct: (e: ProductInSupplyDatabaseRecord) => void
};


function SupplyProductDetail(props: Props): ReactElement {
   const { currentProduct, setCurrentProduct } = props;
   const [productList, setProductList] = useState<ProductInSupplyDatabaseRecord[]>([]);
   const [currentProductData, setCurrentProductData] = useState<SupplyListDatabaseRecord[]>([]);


   useEffect(() => {
      const route = '/api/grocerySupplyOverview/productList';
      fetchData<ProductInSupplyDatabaseRecord[]>(route, setProductList);
   }, []);


   useEffect(() => {
      if (currentProduct) {
         const route = `/api/grocerySupplyOverview/productData/${currentProduct.id}`;
         fetchData<SupplyListDatabaseRecord[]>(route, setCurrentProductData);
      }
   }, [currentProduct]);


   function setSearchedProduct(name: string) {
      let product: ProductInSupplyDatabaseRecord | undefined;
      if (productList) {
         product = productList.find((element) => element.name === name);
      }
      if (product) {
         setCurrentProduct(product);
      }
   }


   function buildProductNameList(productListData: ProductInSupplyDatabaseRecord[]): string[] {
      return productListData.map((product) => product.name);
   }


   function buildBreadcrumb(): ReactElement | null {
      const isRenderable = currentProductData && currentProductData.length > 0;
      if (isRenderable) {
         const product = currentProductData[0];
         return (
            <p id="supply-product-detail-breadcrumb">
               {`${product.topcategory} > ${product.subcategory} > `}
               <b>{product.product}</b>
            </p>
         );
      }
      return null;
   }


   function buildSupplyTable(): ReactElement | null {
      const isRenderable = currentProductData && currentProductData.length > 0;
      if (isRenderable) {
         const headerList = ['Id', 'Distributor', 'Buy Date', 'Expiration Date'];
         const rowList: string[][] = [];
         currentProductData.forEach(
            (item) => rowList.push(
               [
                  item.id.toString(),
                  item.distributor,
                  parseDatabaseDate(item.buyDate),
                  parseDatabaseDate(item.expirationDate)
               ]
            )
         );
         return <Table headerList={headerList} rowList={rowList} key={1} />;
      }
      return null;
   }


   return (
      <>
         <div id="supply-product-detail-header">
            <h2>Product Supply</h2>
            <SearchBar
               id="supply-product-detail-searchbar"
               placeholderText="Product"
               optionList={buildProductNameList(productList)}
               action={setSearchedProduct}
            />
         </div>
         {buildBreadcrumb()}
         {buildSupplyTable()}
      </>
   );

}


export { SupplyProductDetail };
