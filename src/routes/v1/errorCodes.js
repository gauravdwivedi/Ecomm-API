const _errors = {
  E0010001: {
    title: 'Internal Server Error',
    message: 'Oops..!! Something went wrong :(',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },

  E0010002: {
    title: 'Invalid request params',
    message: 'Invalid request params',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0010003: {
    title: 'Something went wrong',
    message: 'Something went wrong!',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0010004: {
    title: 'Invalid request',
    message: 'Invalid / missing JSON body attribute(s)',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  //Login related errors
  E0020001: {
    title: 'Incorrect password',
    message: 'Incorrect password',
    info: {
      type: "fullScreen",
      data: {
        description: "Incorrect password",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0010006: {
    title: 'Invaild Variant ID',
    message: 'Invalid / Product is not found',
    info: {
      type: "fullScreen",
      data: {
        description: "Product is not found",
        cta: "retry",
        label: "Retry"
      }
    }
  },

  E0010007: {
    title: 'Order not available fo user',
    message: 'Invalid / Order is not found',
    info: {
      type: "fullScreen",
      data: {
        description: "Order is not found",
        cta: "retry",
        label: "Retry"
      }
    }
  },

  E0010008: {
    title: 'User Already liked this product',
    message: 'Already liked',
    info: {
      type: "fullScreen",
      data: {
        description: "User Already liked this product",
        cta: "oops !",
        label: "Oops !"
      }
    }
  },

  E0010009: {
    title: 'ZipCode Should be Number',
    message: 'zipCode Should be Numbe',
    info: {
      type: "fullScreen",
      data: {
        description: "ZipCode Should be Number",
        cta: "oops !",
        label: "Oops !"
      }
    }
  },
};

module.exports = {
  errors: _errors
};
