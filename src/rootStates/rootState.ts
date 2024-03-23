import { RefObject } from 'react';
import { Item } from '../features/screens/ExpensesScreen';
import { PieChart } from 'react-native-chart-kit';

export type RootState = {
  name: {
    selectedCurrencyOptionRadioButton: string;
    initialBudget: {
      initialBudgetValue: number;
    };
    googleAccountName: string | null;
    expensesScreenCategoryName: string;
    itemsExpensesScreenCategory: Item[];
    itemsExpensesScreenAccount: Item[];
    expensesScreenValue: 0;
    expensesScreenTitle: '';
    expensesScreenNotes: '';
    expensesScreenDate: '';
    settingsScreenActualCurrency: string;
    mainContentScreenExpensesArray: any[];
    mainContentScreenIncomeArray: any[];
    mainContentScreenSavingsArray: any[];
    mainContentScreenInvestmentsArray: any[];
    chartRef: RefObject<PieChart>;
    transactionsScreenExpenseUpdateModal: {
      isOpen: boolean;
      documentId: string;
    };
    transactionsScreenIncomeUpdateModal: {
      isOpen: boolean;
      documentId: string;
    };
    transactionsScreenSavingsUpdateModal: {
      isOpen: boolean;
      documentId: string;
    };
    transactionsScreenInvestmentsUpdateModal: {
      isOpen: boolean;
      documentId: string;
    };
    expenseDateTimeCET: string;
    isExpenseScreenFirstRun: boolean;
    isIncomeScreenFirstRun: boolean;
    isSavingsScreenFirstRun: boolean;
    isInvestmentScreenFirstRun: boolean;
    shouldExpenseScreenNavigateToMainContent: boolean;
    shouldIncomeScreenNavigateToMainContent: boolean;
    onlyOneMonthDocs: boolean;
    onlyThreeMonthsDocs: boolean;
    onlySixMonthsDocs: boolean;
    onlyOneYearDocs: boolean;
    googleUserFromSettings: null;
    receiptTotalValuePhotoScreen: number;
    limitFoodBudget: {
      limitFoodBudgetValue: number;
      limitBudgetCurrency: string;
    };
    limitShoppingBudget: {
      limitShoppingBudgetValue: number;
      limitShoppingBudgetCurrency: string;
    };
    limitHomeBudget: {
      limitHomeBudgetValue: number;
      limitHomeBudgetCurrency: string;
    };
    limitPublicTransportBudget: {
      limitPublicTransportBudgetValue: number;
      limitPublicTransportBudgetCurrency: string;
    };
    limitCarBudget: {
      limitCarBudgetValue: number;
      limitCarBudgetCurrency: string;
    };
    limitLoanBudget: {
      limitLoanBudgetValue: number;
      limitLoanBudgetCurrency: string;
    };
    limitEntertainmentBudget: {
      limitEntertainmentBudgetValue: number;
      limitEntertainmentBudgetCurrency: string;
    };
    limitElectronicsBudget: {
      limitElectronicsBudgetValue: number;
      limitElectronicsBudgetCurrency: string;
    };
    limitEducationBudget: {
      limitEducationBudgetValue: number;
      limitEducationBudgetCurrency: string;
    };
    limitGiftsBudget: {
      limitGiftsBudgetValue: number;
      limitGiftsBudgetCurrency: string;
    };
    limitTrainingBudget: {
      limitTrainingBudgetValue: number;
      limitTrainingBudgetCurrency: string;
    };
    limitHealthBudget: {
      limitHealthBudgetValue: number;
      limitHealthBudgetCurrency: string;
    };
    limitHolidaysBudget: {
      limitHolidaysBudgetValue: number;
      limitHolidaysBudgetCurrency: string;
    };
    resetAllDataFromAsyncStorage: boolean;
    isGoogleUser: {
      isGoogleUserLoggedIn: boolean;
      userGoogleUId: string | null;
    };
    languageOption: string;
    isConnectedToNetwork: boolean;
    currencyAsMainOption: string;
  };
};
