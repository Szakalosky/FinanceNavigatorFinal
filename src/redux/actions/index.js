import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState } from '../../rootStates/rootState';
import { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
export const setCurrency = (selectedCurrencyOptionRadioButton) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'welcomeMainCurrency',
        JSON.stringify({ selectedCurrencyOptionRadioButton })
      );
      dispatch({
        type: 'SET_MAIN_CURRENCY_TO_ASYNC_STORAGE',
        payload: selectedCurrencyOptionRadioButton,
      });
    } catch (error) {
      console.error('Error setting welcomeMainCurrency in AsyncStorage', error);
    }
  };
};

export const setCurrencyAsMainFromSettingsToAsyncStorage = (currencyAsMainOption) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('currencyAsMainOption', JSON.stringify({ currencyAsMainOption }));
      dispatch({
        type: 'SET_CURRENCY_AS_MAIN_FROM_SETTINGS_TO_ASYNC_STORAGE',
        payload: currencyAsMainOption,
      });
    } catch (error) {
      console.error('Error setting currencyAsMainOption in AsyncStorage', error);
    }
  };
};

export const setLanguageFromSettingsToAsyncStorage = (languageOption) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('languageFromSettings', JSON.stringify({ languageOption }));
      dispatch({
        type: 'SET_LANGUAGE_FROM_SETTINGS_TO_ASYNC_STORAGE',
        payload: { languageOption },
      });
    } catch (error) {
      console.error('Error setting languageSetting in AsyncStorage', error);
    }
  };
};

export const setBudgetValue = (initialBudgetValue) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('initialBudgetValue', JSON.stringify({ initialBudgetValue }));
      dispatch({
        type: 'SET_BUDGET_VALUE',
        payload: { initialBudgetValue },
      });
    } catch (error) {
      console.error('Error setting initialBudgetValue in AsyncStorage', error);
    }
  };
};

export const getGoogleAccountName = (googleAccountName) => {
  return {
    type: 'GET_GOOGLE_ACCOUNT_NAME',
    payload: googleAccountName,
  };
};

export const setKeepUserLoggedIn = (isGoogleUserLoggedIn, userGoogleUId) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'keepGoogleUserLoggedIn',
        JSON.stringify({ isGoogleUserLoggedIn, userGoogleUId })
      );
      dispatch({
        type: 'SET_USER_LOGGED_IN',
        payload: { isGoogleUserLoggedIn, userGoogleUId },
      });
    } catch (error) {
      console.error('Error setting keepGoogleUserLoggedIn in AsyncStorage', error);
    }
  };
};

export const setExpensesScreenCategoryMenu = (name) => {
  return {
    type: 'SET_EXPENSES_CATEGORY_NAME',
    payload: name,
  };
};

export const setWelcomeScreenMainLanguage = (name) => {
  return {
    type: 'SET_WELCOME_SCREEN_MAIN_LANGUAGE',
    payload: name,
  };
};

export const setExpensesScreenItemsAccount = (items) => {
  return {
    type: 'SET_EXPENSES_ITEMS_ACCOUNT',
    payload: items,
  };
};

export const setExpensesScreenValue = (value) => {
  return {
    type: 'SET_EXPENSES_SCREEN_VALUE',
    payload: value,
  };
};

export const setExpensesScreenTitle = (name) => {
  return {
    type: 'SET_EXPENSES_SCREEN_TITLE',
    payload: name,
  };
};

export const setExpensesScreenNotes = (name) => {
  return {
    type: 'SET_EXPENSES_SCREEN_NOTES',
    payload: name,
  };
};

export const setExpensesScreenDate = (date) => {
  return {
    type: 'SET_EXPENSES_SCREEN_NOTES',
    payload: date,
  };
};

export const setSettingsScreenActualCurrency = (value) => {
  return {
    type: 'SET_SETTINGS_SCREEN_ACTUAL_CURRENCY',
    payload: value,
  };
};

export const setMainContentScreenExpensesArray = (items) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_EXPENSES_ARRAY',
    payload: items,
  };
};

export const setMainContentScreenIncomeArray = (items) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_INCOME_ARRAY',
    payload: items,
  };
};

export const setMainContentScreenSavingsArray = (items) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_SAVINGS_ARRAY',
    payload: items,
  };
};

export const setMainContentScreenInvestmentsArray = (items) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_INVESTMENTS_ARRAY',
    payload: items,
  };
};

export const setMainContentScreenExportChart = (chartInfo) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_EXPORT_CHART',
    payload: { chartInfo },
  };
};

export const setTransactionsScreenExpenseUpdateModal = (isOpen, documentId) => {
  return {
    type: 'SET_TRANSACTIONS_SCREEN_EXPENSE_UPDATE_MODAL',
    payload: { isOpen, documentId },
  };
};

export const setTransactionsScreenIncomeUpdateModal = (isOpen, documentId) => {
  return {
    type: 'SET_TRANSACTIONS_SCREEN_INCOME_UPDATE_MODAL',
    payload: { isOpen, documentId },
  };
};

export const setTransactionsScreenSavingsUpdateModal = (isOpen, documentId) => {
  return {
    type: 'SET_TRANSACTIONS_SCREEN_SAVINGS_UPDATE_MODAL',
    payload: { isOpen, documentId },
  };
};

export const setTransactionsScreenInvestmentsUpdateModal = (isOpen, documentId) => {
  return {
    type: 'SET_TRANSACTIONS_SCREEN_INVESTMENTS_UPDATE_MODAL',
    payload: { isOpen, documentId },
  };
};

export const setSettingsScreenExpenseNotifications = (dateTimeCET) => {
  return {
    type: 'SET_SETTINGS_SCREEN_EXPENSE_NOTIFICATIONS',
    payload: dateTimeCET,
  };
};

export const setExpenseScreenNotFirstRun = () => {
  return {
    type: 'SET_EXPENSE_SCREEN_NOT_FIRST_RUN',
  };
};

export const setIncomeScreenNotFirstRun = () => {
  return {
    type: 'SET_INCOME_SCREEN_NOT_FIRST_RUN',
  };
};

export const setSavingsScreenNotFirstRun = () => {
  return {
    type: 'SET_SAVINGS_SCREEN_NOT_FIRST_RUN',
  };
};

export const setInvestmentScreenNotFirstRun = () => {
  return {
    type: 'SET_INVESTMENT_SCREEN_NOT_FIRST_RUN',
  };
};

export const navigateToMainContent = () => {
  return {
    type: 'NAVIGATE_TO_MAIN_CONTENT',
  };
};

export const setOnlyOneMonthDocs = (onlyOneMonthDocs) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_ONE_MONTH_DOCS',
    payload: onlyOneMonthDocs,
  };
};

export const setOnlyThreeMonthsDocs = (onlyThreeMonthsDocs) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_THREE_MONTHS_DOCS',
    payload: onlyThreeMonthsDocs,
  };
};

export const setOnlySixMonthsDocs = (onlySixMonthsDocs) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_SIX_MONTHS_DOCS',
    payload: onlySixMonthsDocs,
  };
};

export const setOnlyOneYearDocs = (onlyOneYearDocs) => {
  return {
    type: 'SET_MAIN_CONTENT_SCREEN_ONE_YEAR_DOCS',
    payload: onlyOneYearDocs,
  };
};

export const setReceiptTotalValuePhotoScreen = (receiptTotalValuePhotoScreen) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem('receiptValue', JSON.stringify({ receiptTotalValuePhotoScreen }));
      dispatch({
        type: 'SET_RECEIPT_TOTAL_VALUE_PHOTO_SCREEN',
        payload: { receiptTotalValuePhotoScreen },
      });
    } catch (error) {
      console.error('Error setting receiptValue in AsyncStorage', error);
    }
  };
};

export const setGoogleUserFromSettingsScreen = (user) => {
  return {
    type: 'SET_GOOGLE_USER_FROM_SETTINGS_SCREEN',
    payload: user,
  };
};

export const setLimitFoodBudgetInBudgetScreen = (limitFoodBudgetValue, limitBudgetCurrency) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitFoodBudget',
        JSON.stringify({ limitFoodBudgetValue, limitBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_FOOD_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitFoodBudgetValue, limitBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitFoodBudget in AsyncStorage', error);
    }
  };
};

export const setLimitShoppingBudgetInBudgetScreen = (
  limitShoppingBudgetValue,
  limitShoppingBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitShoppingBudget',
        JSON.stringify({ limitShoppingBudgetValue, limitShoppingBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_SHOPPING_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitShoppingBudgetValue, limitShoppingBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitShoppingBudget in AsyncStorage', error);
    }
  };
};

export const setLimitHomeBudgetInBudgetScreen = (limitHomeBudgetValue, limitHomeBudgetCurrency) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitHomeBudget',
        JSON.stringify({ limitHomeBudgetValue, limitHomeBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_HOME_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitHomeBudgetValue, limitHomeBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitHomeBudget in AsyncStorage', error);
    }
  };
};

export const setLimitTransportBudgetInBudgetScreen = (
  limitPublicTransportBudgetValue,
  limitPublicTransportBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitTransportBudget',
        JSON.stringify({ limitPublicTransportBudgetValue, limitPublicTransportBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_PUBLIC_TRANSPORT_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitPublicTransportBudgetValue, limitPublicTransportBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitTransportBudget in AsyncStorage', error);
    }
  };
};

export const setLimitCarBudgetInBudgetScreen = (limitCarBudgetValue, limitCarBudgetCurrency) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitCarBudget',
        JSON.stringify({ limitCarBudgetValue, limitCarBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_CAR_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitCarBudgetValue, limitCarBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitCarBudget in AsyncStorage', error);
    }
  };
};

export const setLimitLoanBudgetInBudgetScreen = (limitLoanBudgetValue, limitLoanBudgetCurrency) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitLoanBudget',
        JSON.stringify({ limitLoanBudgetValue, limitLoanBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_LOAN_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitLoanBudgetValue, limitLoanBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitLoanBudget in AsyncStorage', error);
    }
  };
};

export const setLimitEntertainmentBudgetInBudgetScreen = (
  limitEntertainmentBudgetValue,
  limitEntertainmentBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitEntertainmentBudget',
        JSON.stringify({ limitEntertainmentBudgetValue, limitEntertainmentBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_ENTERTAINMENT_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitEntertainmentBudgetValue, limitEntertainmentBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitEntertainmentBudget in AsyncStorage', error);
    }
  };
};

export const setLimitElectronicsBudgetInBudgetScreen = (
  limitElectronicsBudgetValue,
  limitElectronicsBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitElectronicsBudget',
        JSON.stringify({ limitElectronicsBudgetValue, limitElectronicsBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_ELECTRONICS_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitElectronicsBudgetValue, limitElectronicsBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitElectronicsBudget in AsyncStorage', error);
    }
  };
};

export const setLimitEducationBudgetInBudgetScreen = (
  limitEducationBudgetValue,
  limitEducationBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitEducationBudget',
        JSON.stringify({ limitEducationBudgetValue, limitEducationBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_EDUCATION_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitEducationBudgetValue, limitEducationBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitEducationBudget in AsyncStorage', error);
    }
  };
};

export const setLimitGiftsBudgetInBudgetScreen = (
  limitGiftsBudgetValue,
  limitGiftsBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitGiftsBudget',
        JSON.stringify({ limitGiftsBudgetValue, limitGiftsBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_GIFTS_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitGiftsBudgetValue, limitGiftsBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitGiftsBudget in AsyncStorage', error);
    }
  };
};

export const setLimitTrainingBudgetInBudgetScreen = (
  limitTrainingBudgetValue,
  limitTrainingBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitTrainingBudget',
        JSON.stringify({ limitTrainingBudgetValue, limitTrainingBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_TRAINING_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitTrainingBudgetValue, limitTrainingBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitTrainingBudget in AsyncStorage', error);
    }
  };
};

export const setLimitHealthBudgetInBudgetScreen = (
  limitHealthBudgetValue,
  limitHealthBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitHealthBudget',
        JSON.stringify({ limitHealthBudgetValue, limitHealthBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_HEALTH_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitHealthBudgetValue, limitHealthBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitHealthBudget in AsyncStorage', error);
    }
  };
};

export const setLimitHolidaysBudgetInBudgetScreen = (
  limitHolidaysBudgetValue,
  limitHolidaysBudgetCurrency
) => {
  return async (dispatch) => {
    try {
      await AsyncStorage.setItem(
        'limitHolidaysBudget',
        JSON.stringify({ limitHolidaysBudgetValue, limitHolidaysBudgetCurrency })
      );
      dispatch({
        type: 'SET_LIMIT_HOLIDAYS_BUDGET_IN_BUDGET_SCREEN',
        payload: { limitHolidaysBudgetValue, limitHolidaysBudgetCurrency },
      });
    } catch (error) {
      console.error('Error setting limitHolidaysBudget in AsyncStorage', error);
    }
  };
};

export const setResetAllDataFromAsyncStorage = (isClickedOn) => {
  return {
    type: 'SET_RESET_ALL_DATA_IN_SETTINGS_SCREEN',
    payload: isClickedOn,
  };
};

export const setConnectedState = (isConnectedToNetwork) => {
  return {
    type: 'SET_CONNECTION_TO_THE_NETWORK',
    payload: isConnectedToNetwork,
  };
};

export const setBudgetDataInBudgetScreen = (category, value, currency) => {
  return {
    type: 'SET_BUDGET_DATA_IN_BUDGET_SCREEN',
    payload: { category, value, currency },
  };
};
