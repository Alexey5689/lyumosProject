import { defineStore } from "pinia";

export const FormControl = defineStore("form-control", {
  state: () => ({
    activForm: false,
    pageNumber: 1,
    description: "",
    arrServises: [],
    email: "",
    phoneNumber: "",
    company: "",
    name: "",
    wrong: false,
    emailPattern: "Шаблон почты mail@mail.ru",
    phonePattern: "Шаблон телефона +7(999)999-99-99",
    response: "",
    thanksForm: false,
  }),
  getters: {
    getFormState() {
      return this.activForm;
    },
    getPageNumber() {
      return this.pageNumber;
    },
    getArrServises() {
      return this.arrServises;
    },
    getWrong() {
      return this.wrong;
    },
    getThanksFormState() {
      return this.thanksForm;
    },
  },
  actions: {
    changActivForm() {
      this.activForm = !this.activForm;
    },
    // отправка даных
    async getInfo() {
      const formData = {
        servises: this.arrServises,
        description: this.description,
        name: this.name,
        phoneNumber: this.phoneNumber,
        email: this.email,
        company: this.company,
      };
      try {
        const resp = await fetch("email.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        this.arrServises = [];
        this.description = "";
        this.name = "";
        this.phoneNumber = "";
        this.company = "";
        this.email = "";
        this.changActivForm();
        this.changeThanksFormState();
        this.pageNumber = 1;
      } catch (err) {}
    },
    passInformation() {
      //регулярные выражения
      let regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let regPhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
      let regName = /^[a-zA-ZА-Яа-яЁё\s]+$/;
      let regCompany = /^[а-яА-ЯёЁa-zA-Z0-9\s]+$/;
      //проверка на заполнение формы "пора познакомиться"

      this.phoneNumber == "" ||
      this.email == "" ||
      this.company == "" ||
      this.name == ""
        ? this.checkWrongFields()
        : !regName.test(this.name)
        ? this.checkWrongName()
        : !regCompany.test(this.company)
        ? this.checkWrongCompany()
        : !regPhone.test(this.phoneNumber)
        ? this.checkWrongPhoneNumber()
        : !regEmail.test(this.email)
        ? this.checkWrongEmail()
        : this.getInfo();
    },
    changePageForvard() {
      //проверка на заполнение формы "Какие услуги вам необходимы"
      this.getArrServises.length === 0 || this.description === ""
        ? this.checkWrongFields()
        : this.pageNumber < 2
        ? this.pageNumber++
        : ""; //переход на на следующую форму
    },
    //переход на предыдущую форму
    changePageBack() {
      this.pageNumber--;
    },
    //проверка корректности
    checkWrongEmail() {
      this.response = 'Некорректно заполнено поле "Моя почта"';
      this.wrongStyle();
    },
    checkWrongName() {
      this.response = 'Некорректно заполнено поле "Меня зовут"';
      this.wrongStyle();
    },
    checkWrongCompany() {
      this.response = 'Некорректно заполнено поле "Я предстовляю компанию"';
      this.wrongStyle();
    },
    checkWrongPhoneNumber() {
      this.response = 'Некорректно заполнено поле "Мой телефон"';
      this.wrongStyle();
    },
    //проверка на заполнение формы
    checkWrongFields() {
      this.response = "Необходимо заполнить все поля, для успешной отправки";
      this.wrongStyle();
    },
    //смена стилей у кнопки при ошибках
    wrongStyle() {
      this.wrong = true;
      setTimeout(() => {
        this.wrong = false;
      }, 2000);
    },
    changeThanksFormState() {
      this.thanksForm = !this.thanksForm;
    },
  },
});
