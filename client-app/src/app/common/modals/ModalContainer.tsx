import { observer } from "mobx-react-lite";
import React from "react";
import { Modal } from "semantic-ui-react";
import { useStore } from "../../stores/store";

export default observer(function ModalContainer() {
  const { modalStore } = useStore();
  console.log("goi khong");
  return (
    <Modal
      open={modalStore.modal.open}
      onClose={modalStore.closeModal}
      size="mini"
    >
      <Modal.Content>{modalStore.modal.body}</Modal.Content>
    </Modal>
  );
});