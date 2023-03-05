import React, { ReactElement, useState, useEffect } from 'react';
import { SearchableDropdown } from '../../base-components/searchableDropdown/SearchableDropdown';
import { UnconsumedItemId, PreviewConsumedItem } from '../../../../tsDataTypes/tsTypeGroceryItemConsume';
import { getInputValue } from '../../../utility/inputValue';
import { fetchData } from '../../../utility/fetchServerData';
import { Table } from '../../base-components/table/Table';
import './groceryItemConsume.css';


function GroceryItemConsume(): ReactElement {

   const [idDropdownContent, setIdDropdownContent] = useState<UnconsumedItemId[]>([]);
   const [previewItemList, setPreviewItemList] = useState<PreviewConsumedItem[]>([]);


   useEffect(() => {
      fetchData<UnconsumedItemId[]>('/api/GroceryItemConsume/unconsumedItemIdList', setIdDropdownContent);
   }, []);


   async function addToPreviewItemList(id: number): Promise<void> {
      const responseData: { data: PreviewConsumedItem }[] = [];
      await fetchData<{ data: PreviewConsumedItem }>(
         `/api/GroceryItemConsume/itemInformationForId/${id}`,
         (response) => responseData.push(response)
      );
      setPreviewItemList([...previewItemList, responseData[0].data]);
   }


   function removeFromPreviewItemList(id: number): void {
      const newList = previewItemList.filter((element) => element.id !== id);
      setPreviewItemList(newList);
   }


   function buildIdDropdownContent(): string[] {
      return idDropdownContent.map((element) => element.id.toString());
   }


   function buildConsumedItemsPreview(): (string | ReactElement)[][] {
      const result = previewItemList.map(
         (element) => [
            element.id.toString(),
            element.productName,
            element.amount,
            element.expirationDate,
            <button type="button" onClick={() => { removeFromPreviewItemList(element.id); }}>
               x
            </button>
         ]
      );
      result.push([
         <>
            <SearchableDropdown
               id="grocery-item-consume-searchbar"
               placeholderText="Unconsumed Product Id"
               optionList={buildIdDropdownContent()}
            />
            <button
               type="button"
               onClick={async () => {
                  const id = parseInt(getInputValue('grocery-item-consume-searchbar'), 10);
                  await addToPreviewItemList(id);
               }}
            >
               +
            </button>
         </>, '', '', '', ''
      ]);
      return result;
   }


   return (
      <div id="grocery-item-consume-container">
         <h2>Consume Grocery Items</h2>
         <Table
            headerList={['Id', 'Product Name', 'Amount', 'Expiration Date', '']}
            rowList={buildConsumedItemsPreview()}
         />
         <div id="grocery-item-consume-consume-button-container">
            <button type="button" onClick={() => {}}>Consume</button>
         </div>
      </div>
   );

}


export { GroceryItemConsume };
