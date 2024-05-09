export class Error {
  constructor(err) {
    this.title = err.response.data.message
    this.status = "error";
    this.duration = 3000;
    this.isClosable = true;
    this.position = "top-right";
  }
}

export class Success {
  constructor(res) {
    this.title = res.data.message
    this.status = "success";
    this.duration = 3000;
    this.isClosable = true;
    this.position = "top-right";
  }
}

