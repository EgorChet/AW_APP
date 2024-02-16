import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import PropTypes from "prop-types";
import { format, parseISO } from "date-fns";
import CustomButton from "./CustomButton";

const EditPurchaseModal = ({ open, onClose, purchase, onSave }) => {
  const [formData, setFormData] = useState({
    number_of_stocks_purchased: purchase?.number_of_stocks_purchased || "",
    purchase_price: purchase?.purchase_price || "",
    purchase_date: format(parseISO(purchase?.purchase_date || new Date()), "yyyy-MM-dd"),
  });

  useEffect(() => {
    // Reset form data when the purchase prop changes
    setFormData({
      number_of_stocks_purchased: purchase?.number_of_stocks_purchased || "",
      purchase_price: purchase?.purchase_price || "",
      purchase_date: format(parseISO(purchase?.purchase_date || new Date()), "yyyy-MM-dd"),
    });
  }, [purchase]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...purchase,
      ...formData,
      purchase_date: new Date(formData.purchase_date).toISOString(), // Convert back to ISO string if needed by your backend
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Purchase</DialogTitle>
      <DialogContent>
        <TextField
          margin='dense'
          name='number_of_stocks_purchased'
          label='Number of Shares'
          type='number'
          fullWidth
          value={formData.number_of_stocks_purchased}
          onChange={handleInputChange}
        />
        <TextField
          margin='dense'
          name='purchase_price'
          label='Purchase Price'
          type='number'
          fullWidth
          value={formData.purchase_price}
          onChange={handleInputChange}
        />
        <TextField
          margin='dense'
          name='purchase_date'
          label='Purchase Date'
          type='date'
          fullWidth
          value={formData.purchase_date}
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={onClose}>Cancel</CustomButton>
        <CustomButton onClick={handleSubmit}>Save</CustomButton>
      </DialogActions>
    </Dialog>
  );
};

EditPurchaseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  purchase: PropTypes.shape({
    id: PropTypes.number.isRequired,
    number_of_stocks_purchased: PropTypes.number.isRequired,
    purchase_price: PropTypes.number.isRequired,
    purchase_date: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditPurchaseModal;
