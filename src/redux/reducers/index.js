const initialState = {
  selectedCurrencyOptionRadioButton: 'PLN',
  initialBudget: {
    initialBudgetValue: 0,
  },
  welcomeScreenMainLanguage: '',
  googleAccountName: '',
  isGoogleUser: {
    isGoogleUserLoggedIn: false,
    userGoogleUId: '',
  },
  expensesScreenCategoryName: '',
  itemsExpensesScreenCategory: [],
  itemsExpensesScreenAccount: [],
  expensesScreenValue: 0,
  expensesScreenTitle: '',
  expensesScreenNotes: '',
  expensesScreenDate: '',
  settingsScreenActualCurrency: 'PLN',
  mainContentScreenExpensesArray: [],
  mainContentScreenIncomeArray: [],
  mainContentScreenSavingsArray: [],
  mainContentScreenInvestmentsArray: [],
  chartRef: null,
  transactionsScreenExpenseUpdateModal: {
    isOpen: false,
    documentId: '',
  },
  transactionsScreenIncomeUpdateModal: {
    isOpen: false,
    documentId: '',
  },
  transactionsScreenSavingsUpdateModal: {
    isOpen: false,
    documentId: '',
  },
  transactionsScreenInvestmentsUpdateModal: {
    isOpen: false,
    documentId: '',
  },
  expenseDateTimeCET: '',
  isExpenseScreenFirstRun: false,
  isIncomeScreenFirstRun: false,
  isSavingsScreenFirstRun: false,
  isInvestmentScreenFirstRun: false,
  shouldExpenseScreenNavigateToMainContent: false,
  onlyOneMonthDocs: false,
  onlyThreeMonthsDocs: false,
  onlySixMonthsDocs: false,
  onlyOneYearDocs: false,
  receiptTotalValuePhotoScreen: 0,
  googleUserFromSettings: null,
  limitFoodBudget: {
    limitFoodBudgetValue: 0,
    limitBudgetCurrency: '',
  },
  limitShoppingBudget: {
    limitShoppingBudgetValue: 0,
    limitShoppingBudgetCurrency: '',
  },
  limitHomeBudget: {
    limitHomeBudgetValue: 0,
    limitHomeBudgetCurrency: '',
  },
  limitPublicTransportBudget: {
    limitPublicTransportBudgetValue: 0,
    limitPublicTransportBudgetCurrency: '',
  },
  limitCarBudget: {
    limitCarBudgetValue: 0,
    limitCarBudgetCurrency: '',
  },
  limitLoanBudget: {
    limitLoanBudgetValue: 0,
    limitLoanBudgetCurrency: '',
  },
  limitEntertainmentBudget: {
    limitEntertainmentBudgetValue: 0,
    limitEntertainmentBudgetCurrency: '',
  },
  limitElectronicsBudget: {
    limitElectronicsBudgetValue: 0,
    limitElectronicsBudgetCurrency: '',
  },
  limitEducationBudget: {
    limitEducationBudgetValue: 0,
    limitEducationBudgetCurrency: '',
  },
  limitGiftsBudget: {
    limitGiftsBudgetValue: 0,
    limitGiftsBudgetCurrency: '',
  },
  limitTrainingBudget: {
    limitTrainingBudgetValue: 0,
    limitTrainingBudgetCurrency: '',
  },
  limitHealthBudget: {
    limitHealthBudgetValue: 0,
    limitHealthBudgetCurrency: '',
  },
  limitHolidaysBudget: {
    limitHolidaysBudgetValue: 0,
    limitHolidaysBudgetCurrency: '',
  },
  resetAllDataFromAsyncStorage: false,
  languageOption: '',
  isConnectedToNetwork: false,
  currencyAsMainOption: 'EUR',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_MAIN_CURRENCY_TO_ASYNC_STORAGE':
      return {
        ...state,
        selectedCurrencyOptionRadioButton: action.payload,
      };
    case 'SET_BUDGET_VALUE':
      return {
        ...state,
        initialBudget: {
          initialBudgetValue: action.payload.initialBudgetValue,
        },
      };
    case 'GET_GOOGLE_ACCOUNT_NAME':
      return {
        ...state,
        googleAccountName: action.payload,
      };
    case 'SET_USER_LOGGED_IN':
      return {
        ...state,
        isGoogleUser: {
          isGoogleUserLoggedIn: action.payload.isGoogleUserLoggedIn,
          userGoogleUId: action.payload.userGoogleUId,
        },
      };
    case 'SET_WELCOME_SCREEN_MAIN_LANGUAGE':
      return {
        ...state,
        welcomeScreenMainLanguage: action.payload,
      };
    case 'SET_EXPENSES_CATEGORY_NAME':
      return {
        ...state,
        expensesScreenCategoryName: action.payload,
      };
    case 'SET_EXPENSES_ITEMS_CATEGORY':
      return {
        ...state,
        name: {
          ...state.name,
          itemsExpensesScreenCategory: action.payload,
        },
      };
    case 'SET_EXPENSES_ITEMS_ACCOUNT':
      return {
        ...state,
        itemsExpensesScreenAccount: action.payload,
      };
    case 'SET_EXPENSES_SCREEN_VALUE':
      return {
        ...state,
        expensesScreenValue: action.payload,
      };
    case 'SET_EXPENSES_SCREEN_TITLE':
      return {
        ...state,
        expensesScreenTitle: action.payload,
      };
    case 'SET_EXPENSES_SCREEN_NOTES':
      return {
        ...state,
        expensesScreenNotes: action.payload,
      };
    case 'SET_EXPENSES_CATEGORY_DATE':
      return {
        ...state,
        expensesScreenDate: action.payload,
      };
    case 'SET_SETTINGS_SCREEN_ACTUAL_CURRENCY':
      return {
        ...state,
        settingsScreenActualCurrency: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_EXPENSES_ARRAY':
      return {
        ...state,
        mainContentScreenExpensesArray: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_INCOME_ARRAY':
      return {
        ...state,
        mainContentScreenIncomeArray: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_SAVINGS_ARRAY':
      return {
        ...state,
        mainContentScreenSavingsArray: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_INVESTMENTS_ARRAY':
      return {
        ...state,
        mainContentScreenInvestmentsArray: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_EXPORT_CHART':
      return {
        ...state,
        chartRef: action.payload,
      };
    case 'SET_TRANSACTIONS_SCREEN_EXPENSE_UPDATE_MODAL':
      return {
        ...state,
        transactionsScreenExpenseUpdateModal: {
          isOpen: action.payload.isOpen,
          documentId: action.payload.documentId,
        },
      };
    case 'SET_TRANSACTIONS_SCREEN_INCOME_UPDATE_MODAL':
      return {
        ...state,
        transactionsScreenIncomeUpdateModal: {
          isOpen: action.payload.isOpen,
          documentId: action.payload.documentId,
        },
      };
    case 'SET_TRANSACTIONS_SCREEN_SAVINGS_UPDATE_MODAL':
      return {
        ...state,
        transactionsScreenSavingsUpdateModal: {
          isOpen: action.payload.isOpen,
          documentId: action.payload.documentId,
        },
      };
    case 'SET_TRANSACTIONS_SCREEN_INVESTMENTS_UPDATE_MODAL':
      return {
        ...state,
        transactionsScreenInvestmentsUpdateModal: {
          isOpen: action.payload.isOpen,
          documentId: action.payload.documentId,
        },
      };
    case 'SET_SETTINGS_SCREEN_EXPENSE_NOTIFICATIONS':
      return {
        ...state,
        expenseDateTimeCET: action.payload,
      };
    case 'SET_EXPENSE_SCREEN_NOT_FIRST_RUN':
      return {
        ...state,
        isExpenseScreenFirstRun: true,
      };
    case 'SET_INCOME_SCREEN_NOT_FIRST_RUN':
      return {
        ...state,
        isIncomeScreenFirstRun: true,
      };
    case 'SET_SAVINGS_SCREEN_NOT_FIRST_RUN':
      return {
        ...state,
        isSavingsScreenFirstRun: true,
      };
    case 'SET_INVESTMENT_SCREEN_NOT_FIRST_RUN':
      return {
        ...state,
        isInvestmentScreenFirstRun: true,
      };
    case 'NAVIGATE_TO_MAIN_CONTENT':
      return {
        ...state,
        shouldExpenseScreenNavigateToMainContent: true,
      };
    case 'SET_MAIN_CONTENT_SCREEN_ONE_MONTH_DOCS':
      return {
        ...state,
        onlyOneMonthDocs: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_THREE_MONTHS_DOCS':
      return {
        ...state,
        onlyThreeMonthsDocs: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_SIX_MONTHS_DOCS':
      return {
        ...state,
        onlySixMonthsDocs: action.payload,
      };
    case 'SET_MAIN_CONTENT_SCREEN_ONE_YEAR_DOCS':
      return {
        ...state,
        onlyOneYearDocs: action.payload,
      };
    case 'SET_RECEIPT_TOTAL_VALUE_PHOTO_SCREEN':
      return {
        ...state,
        receiptTotalValuePhotoScreen: action.payload.receiptTotalValuePhotoScreen,
      };
    case 'SET_GOOGLE_USER_FROM_SETTINGS_SCREEN':
      return {
        ...state,
        googleUserFromSettings: action.payload.googleUserFromSettings,
      };
    case 'SET_LIMIT_FOOD_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitFoodBudget: {
          limitFoodBudgetValue: action.payload.limitFoodBudgetValue,
          limitBudgetCurrency: action.payload.limitBudgetCurrency,
        },
      };
    case 'SET_LIMIT_SHOPPING_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitShoppingBudget: {
          limitShoppingBudgetValue: action.payload.limitShoppingBudgetValue,
          limitShoppingBudgetCurrency: action.payload.limitShoppingBudgetCurrency,
        },
      };
    case 'SET_LIMIT_HOME_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitHomeBudget: {
          limitHomeBudgetValue: action.payload.limitHomeBudgetValue,
          limitHomeBudgetCurrency: action.payload.limitHomeBudgetCurrency,
        },
      };
    case 'SET_LIMIT_PUBLIC_TRANSPORT_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitPublicTransportBudget: {
          limitPublicTransportBudgetValue: action.payload.limitPublicTransportBudgetValue,
          limitPublicTransportBudgetCurrency: action.payload.limitPublicTransportBudgetCurrency,
        },
      };
    case 'SET_LIMIT_CAR_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitCarBudget: {
          limitCarBudgetValue: action.payload.limitCarBudgetValue,
          limitCarBudgetCurrency: action.payload.limitCarBudgetCurrency,
        },
      };
    case 'SET_LIMIT_LOAN_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitLoanBudget: {
          limitLoanBudgetValue: action.payload.limitLoanBudgetValue,
          limitLoanBudgetCurrency: action.payload.limitLoanBudgetCurrency,
        },
      };
    case 'SET_LIMIT_ENTERTAINMENT_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitEntertainmentBudget: {
          limitEntertainmentBudgetValue: action.payload.limitEntertainmentBudgetValue,
          limitEntertainmentBudgetCurrency: action.payload.limitEntertainmentBudgetCurrency,
        },
      };
    case 'SET_LIMIT_ELECTRONICS_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitElectronicsBudget: {
          limitElectronicsBudgetValue: action.payload.limitElectronicsBudgetValue,
          limitElectronicsBudgetCurrency: action.payload.limitElectronicsBudgetCurrency,
        },
      };
    case 'SET_LIMIT_EDUCATION_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitEducationBudget: {
          limitEducationBudgetValue: action.payload.limitEducationBudgetValue,
          limitEducationBudgetCurrency: action.payload.limitEducationBudgetCurrency,
        },
      };
    case 'SET_LIMIT_GIFTS_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitGiftsBudget: {
          limitGiftsBudgetValue: action.payload.limitGiftsBudgetValue,
          limitGiftsBudgetCurrency: action.payload.limitGiftsBudgetCurrency,
        },
      };
    case 'SET_LIMIT_TRAINING_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitTrainingBudget: {
          limitTrainingBudgetValue: action.payload.limitTrainingBudgetValue,
          limitTrainingBudgetCurrency: action.payload.limitTrainingBudgetCurrency,
        },
      };
    case 'SET_LIMIT_HEALTH_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitHealthBudget: {
          limitHealthBudgetValue: action.payload.limitHealthBudgetValue,
          limitHealthBudgetCurrency: action.payload.limitHealthBudgetCurrency,
        },
      };
    case 'SET_LIMIT_HOLIDAYS_BUDGET_IN_BUDGET_SCREEN':
      return {
        ...state,
        limitHolidaysBudget: {
          limitHolidaysBudgetValue: action.payload.limitHolidaysBudgetValue,
          limitHolidaysBudgetCurrency: action.payload.limitHolidaysBudgetCurrency,
        },
      };
    case 'SET_RESET_ALL_DATA_IN_SETTINGS_SCREEN':
      return {
        ...state,
        resetAllDataFromAsyncStorage: action.payload,
      };
    case 'SET_LANGUAGE_FROM_SETTINGS_TO_ASYNC_STORAGE':
      return {
        ...state,
        languageOption: action.payload.languageOption,
      };
    case 'SET_CONNECTION_TO_THE_NETWORK':
      return {
        ...state,
        isConnectedToNetwork: action.payload,
      };
    case 'SET_CURRENCY_AS_MAIN_FROM_SETTINGS_TO_ASYNC_STORAGE':
      return {
        ...state,
        currencyAsMainOption: action.payload.currencyAsMainOption,
      };
    default:
      return state;
  }
};

export const SignInReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GOOGLE_USER_FROM_SETTINGS_SCREEN':
      return {
        googleUserFromSettings: action.payload.googleUserFromSettings,
      };
    default:
      return state;
  }
};

export default rootReducer;
