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
};

module.exports = {
  errors: _errors
};
