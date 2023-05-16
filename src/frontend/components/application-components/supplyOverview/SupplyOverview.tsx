import React, { ReactElement, useState, useEffect } from 'react';
import { fetchData } from '../../../utility/fetchServerData';
import { Category } from '../../base-components/category/Category';
import { Table } from '../../base-components/table/Table';
import {
   ProductSupplyOverview,
   SubCategory,
   TopCategory,
   SupplyOverviewFrontendData
} from '../../../../tsDataTypes/tsTypesGrocerySupplyOverview';
import './supplyOverview.css';


function generateProductTable(productList: ProductSupplyOverview[] | undefined):
ReactElement[] | [] {
   if (productList) {
      const headerList = ['Product', 'Amount'];
      const rowList: string[][] = [];
      productList.forEach((product) => rowList.push([product.name, `${product.total}`]));
      return [<Table headerList={headerList} rowList={rowList} key={1} />];
   }
   return [];
}


function generateSubCategory(subCategory: SubCategory, key: number): ReactElement {
   return (
      <Category
         name={subCategory.name}
         additionalText={`${subCategory.total} Items`}
         contentList={generateProductTable(subCategory.productList)}
         isContentLevel
         key={key}
      />
   );
}


function generateTopCategory(topCategory: TopCategory, key: number): ReactElement {
   let contentList: ReactElement[] | [] = [];
   if (topCategory.subCategoryList) {
      contentList = topCategory.subCategoryList.map(
         (subcategory, index) => generateSubCategory(subcategory, index)
      );
   }

   return (
      <Category
         name={topCategory.name}
         additionalText={`${topCategory.total} Items`}
         contentList={contentList}
         isTopLevel
         key={key}
      />
   );
}


function SupplyOverview(): ReactElement | null {
   const [supplyOverviewData, setSupplyOverviewData] = useState<SupplyOverviewFrontendData>();


   useEffect(() => {
      fetchData<SupplyOverviewFrontendData>('/api/supplyOverview', setSupplyOverviewData);
   }, []);


   function generateGrocerySupplyOverview(): ReactElement | null {
      const isDataRenderable = supplyOverviewData && supplyOverviewData.data;
      if (isDataRenderable) {
         return (
            <>
               {
                  supplyOverviewData.data.map(
                     (topCategory, index) => generateTopCategory(topCategory, index)
                  )
               }
            </>
         );
      }
      return null;
   }


   return (
      <>
         <h2>Supply Overview</h2>
         { generateGrocerySupplyOverview() }
      </>
   );
}


export { SupplyOverview };
