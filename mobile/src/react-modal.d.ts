declare module 'react-modal' {
    import * as React from 'react';
  
    interface ModalProps {
      isOpen: boolean;
      onRequestClose: () => void;
      contentLabel?: string;
      className?: string;
      overlayClassName?: string;
      style?: {
        content?: React.CSSProperties;
        overlay?: React.CSSProperties;
      };
      shouldCloseOnOverlayClick?: boolean;
      shouldCloseOnEsc?: boolean;
      ariaHideApp?: boolean;
      appElement?: HTMLElement | null;
      closeTimeoutMS?: number;
      parentSelector?: () => HTMLElement;
    }
  
    export default class Modal extends React.Component<ModalProps> {
      static setAppElement(element: HTMLElement | null): void;
    }
  }
  