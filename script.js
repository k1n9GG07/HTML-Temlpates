class FinancialCalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.initialRender();
  }

  // Методы жизненного цикла Custom Elements API
  connectedCallback() {
    console.log('Компонент финансового калькулятора создан и добавлен на страницу.');
    this.addEventListeners();
    this.render();
  }

  disconnectedCallback() {
    console.log('Компонент финансового калькулятора удалён со страницы.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Атрибут ${name} изменён с ${oldValue} на ${newValue}.`);
    // Можно обработать изменения атрибутов, если это необходимо
  }

  // Начальная отрисовка Shadow DOM
  initialRender() {
    this.shadowRoot.innerHTML = `
      <style>
        .calculator-container {
          font-family: Arial, sans-serif;
          background-color: #f0f4f8;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: auto;
        }
        h2 {
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          color: #555;
        }
        input[type="number"] {
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .results {
          margin-top: 20px;
          padding: 15px;
          background-color: #e9ecef;
          border-radius: 4px;
        }
        .results p {
          margin: 5px 0;
        }
        .error {
          color: red;
          margin-bottom: 10px;
        }
      </style>
      <div class="calculator-container">
        <h2>Финансовый калькулятор</h2>
        <div class="form-group">
          <label for="amount">Сумма кредита:</label>
          <input type="number" id="amount" value="1000000" min="0">
        </div>
        <div class="form-group">
          <label for="rate">Процентная ставка (% годовых):</label>
          <input type="number" id="rate" value="10" min="0" step="0.1">
        </div>
        <div class="form-group">
          <label for="term">Срок кредита (лет):</label>
          <input type="number" id="term" value="10" min="1">
        </div>
        <div class="error" id="error-message"></div>
        <div class="results">
          <h3>Результаты:</h3>
          <p>Ежемесячный платеж: <span id="monthly-payment">0</span> ₽</p>
          <p>Общая сумма к выплате: <span id="total-payment">0</span> ₽</p>
          <p>Общий процент: <span id="total-interest">0</span> ₽</p>
        </div>
      </div>
    `;
  }

  // Добавление обработчиков событий
  addEventListeners() {
    this.shadowRoot.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => this.updateCalculation());
    });
  }

  // Валидация и обновление расчетов
  updateCalculation() {
    console.log('Данные обновлены. Пересчёт...');
    const amount = parseFloat(this.shadowRoot.getElementById('amount').value);
    const rate = parseFloat(this.shadowRoot.getElementById('rate').value);
    const term = parseFloat(this.shadowRoot.getElementById('term').value);
    const errorElement = this.shadowRoot.getElementById('error-message');

    if (isNaN(amount) || isNaN(rate) || isNaN(term) || amount <= 0 || rate < 0 || term < 1) {
      errorElement.textContent = 'Пожалуйста, введите корректные положительные значения.';
      this.resetResults();
      return;
    } else {
      errorElement.textContent = '';
    }

    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - amount;

    this.shadowRoot.getElementById('monthly-payment').textContent = monthlyPayment.toFixed(2);
    this.shadowRoot.getElementById('total-payment').textContent = totalPayment.toFixed(2);
    this.shadowRoot.getElementById('total-interest').textContent = totalInterest.toFixed(2);
  }

  // Сброс результатов
  resetResults() {
    this.shadowRoot.getElementById('monthly-payment').textContent = '0';
    this.shadowRoot.getElementById('total-payment').textContent = '0';
    this.shadowRoot.getElementById('total-interest').textContent = '0';
  }

  // Рендеринг компонента
  render() {
    this.updateCalculation();
  }
}

// Регистрация пользовательского элемента
customElements.define('financial-calculator', FinancialCalculator);
