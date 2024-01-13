#include <iostream>
using namespace std;

int main() {
    int year, month;

    cout << "Введите год: ";
    cin >> year;
    cout << "Введите месяц (1-12): ";
    cin >> month;

    // Вычисляем количество дней в месяце
    int daysInMonth;
    if (month == 2) {
        if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
            daysInMonth = 29;
        } else {
            daysInMonth = 28;
        }
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        daysInMonth = 30;
    } else {
        daysInMonth = 31;
    }

    // Выводим заголовок календаря
    cout << " Пн Вт Ср Чт Пт Сб Вс" << endl;

    // Определяем день недели для первого числа месяца
    int startDay;
    startDay = year * 365 + (year - 1) / 4 - (year - 1) / 100 + (year - 1) / 400;
    for (int i = 1; i < month; i++) {
        if (i == 2) {
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
                startDay += 29;
            } else {
                startDay += 28;
            }
        } else if (i == 4 || i == 6 || i == 9 || i == 11) {
            startDay += 30;
        } else {
            startDay += 31;
        }
    }
    startDay = startDay % 7;

    // Выводим пустые ячейки до начала месяца
    for (int i = 0; i < startDay; i++) {
        cout << "   ";
    }

    // Выводим числа месяца
    for (int day = 1; day <= daysInMonth; day++) {
        cout << " " << day;
        startDay++;
        if (startDay % 7 == 0) {
            cout << endl;
        }
    }

    return 0;
}
