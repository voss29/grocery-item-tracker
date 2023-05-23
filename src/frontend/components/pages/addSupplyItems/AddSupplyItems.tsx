/* eslint-disable react/jsx-no-bind */
import React, { ReactElement, useState } from 'react';
import { SupplyAddItemDialog } from '../../application-components/supplyAddItemDialog/supplyAddItemDialog/SupplyAddItemDialog';
import { ProductDataAddDialog } from '../../application-components/supplyAddItemDialog/productDataAddDialog/ProductDataAddDialog';
import { ProductSelectionDialog } from '../../application-components/supplyAddItemDialog/productSelectionDialog/ProductSelectionDialog';
import { SupplyAddedItemsReceipt } from '../../application-components/supplyAddItemDialog/supplyAddedItemsReceipt/SupplyAddedItemsReceipt';
import { GroceryItemData, AddedItemReceiptData } from '../../../../tsDataTypes/tsTypesGroceryItemAdd';
import './groceryItemAdd.css';


type PageState = 'ReceiptItemsAddedState' | 'ItemAddPreviewState' | 'ItemAddState' | 'ProductAddState';


function AddSupplyItems(): ReactElement {

   const [pageState, setPageState] = useState<PageState>('ItemAddPreviewState');
   const [groceryItemList, setGroceryItemList] = useState<GroceryItemData[]>([]);
   const [unusedGroceryItemId, setUnusedGroceryItemId] = useState(1);
   const [addedItemsReceiptList, setAddedItemsReceiptList] = useState<AddedItemReceiptData[]>([]);


   function addGroceryItemToList(item: GroceryItemData): void {
      const newItem = item;
      newItem.id = unusedGroceryItemId;
      setUnusedGroceryItemId((value) => value + 1);
      setGroceryItemList([...groceryItemList, newItem]);
   }


   function removeGroceryItemFromList(id: number): void {
      const newList = groceryItemList.filter((item) => item.id !== id);
      setGroceryItemList(newList);
   }


   function openAddedItemsReceipt() {
      setPageState('ReceiptItemsAddedState');
   }


   function openItemAddOverview() {
      setPageState('ItemAddPreviewState');
   }


   function openItemAddDialog() {
      setPageState('ItemAddState');
   }


   function openProductAddDialog() {
      setPageState('ProductAddState');
   }


   function renderDialog(): ReactElement | null {
      switch (pageState) {
         case 'ReceiptItemsAddedState':
            return (
               <SupplyAddedItemsReceipt
                  addedItemsReceiptDataList={addedItemsReceiptList}
               />
            );
         case 'ItemAddPreviewState':
            return (
               <SupplyAddItemDialog
                  setAddedItemsReceiptList={setAddedItemsReceiptList}
                  openItemAddDialog={openItemAddDialog}
                  openAddedItemsReceipt={openAddedItemsReceipt}
                  removeGroceryItemFromList={removeGroceryItemFromList}
                  groceryItemDataList={groceryItemList}
               />
            );
         case 'ItemAddState':
            return (
               <ProductSelectionDialog
                  addGroceryItemData={addGroceryItemToList}
                  openProductAddDialog={openProductAddDialog}
                  openItemAddOverview={openItemAddOverview}
               />
            );
         case 'ProductAddState':
            return <ProductDataAddDialog openItemAddDialog={openItemAddDialog} />;
         default:
            return null;
      }
   }


   return (
      <div id="grocery-item-add-container">
         { renderDialog() }
      </div>
   );
}


export { AddSupplyItems };