export class CustomException {
  constructor(message) {
    this.message = message;
  }
  data() {
    const error = this.message;

    if (error.response?.data?.error) return error.response.data.error;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.data) return error.response.data;

    return 'Ocorreu um erro desconhecido!';
  }
}
