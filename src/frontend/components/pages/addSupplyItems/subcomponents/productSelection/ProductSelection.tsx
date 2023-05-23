/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement, useState } from 'react';
import { Counter } from '../../../../base-components/counter/Counter';
import { ProductInput } from './subcomponents/productInput/ProductInput';
import { DistributorInput } from './subcomponents/distributorInput/DistributorInput';
import { GroceryItemData } from '../../../../../../tsDataTypes/tsTypesGroceryItemAdd';
import './productSelection.css';


type ProductSelectionDialogProps = {
   addGroceryItemData: (data: GroceryItemData) => void,
   openItemAddOverview: () => void,
   openProductAddDialog: () => void
};


function ProductSelection(props: ProductSelectionDialogProps): ReactElement {
   const { addGroceryItemData, openItemAddOverview, openProductAddDialog } = props;

   const [productName, setProductName] = useState('');
   const [distributor, setDistributor] = useState('');
   const [amount, setAmount] = useState(1);
   const [unitPrice, setUnitPrice] = useState(1);
   const [expirationDate, setExpirationDate] = useState('');


   function addGroceryItemDataToList(): void {
      const payload = {
         id: -1,
         productName,
         distributor,
         amount,
         pricePerUnit: unitPrice,
         expirationDate
      };
      addGroceryItemData(payload);
      openItemAddOverview();
   }


   return (
      <div id="grocery-item-product-selection-container">
         <h2>Select Grocery Item</h2>
         <form id="product-selection-dialog">
            <ProductInput
               openProductAddDialog={openProductAddDialog}
               setProductInput={setProductName}
               productInput={productName}
            />
            <DistributorInput
               distributorInput={distributor}
               setDistributorInput={setDistributor}
            />
            <label>Amount</label>
            <Counter value={amount} setValue={setAmount} />
            <label htmlFor="input-price-per-unit" className="product-selection-dialog-label">Unit Price</label>
            <input
               id="input-price-per-unit"
               name="pricePerUnit"
               className="product-selection-dialog-input"
               type="number"
               min={1}
               value={unitPrice}
               onChange={(e) => { setUnitPrice(Number.parseInt(e.target.value, 10)); }}
               required
            />
            <label htmlFor="input-expiration-date" className="product-selection-dialog-label">Expiration Date</label>
            <input
               id="input-expiration-date"
               name="expirationDate"
               className="product-selection-dialog-input"
               type="date"
               value={expirationDate}
               onChange={(e) => { setExpirationDate(e.target.value); }}
               required
            />
            <div id="add-button-container">
               <button type="button" onClick={addGroceryItemDataToList}>Add</button>
            </div>
         </form>
      </div>
   );
}


export { ProductSelection };