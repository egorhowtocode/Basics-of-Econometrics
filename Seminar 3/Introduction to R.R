# Базовые классы

numeric = 10
print(numeric)
class(numeric) # Можете проверить класс с помощью соответствующей команды

character = "10"
print(character)
class(character)

boolean = TRUE # можно просто T
print(boolean)
class(boolean)

# Трансформация из одного класса в другой

numeric_from_character = as.numeric(character)
numeric_from_character

# логические выражения
numeric > "9"
numeric > 9
numeric == numeric_from_character


# Классы для структур данных
vector = c(4, 1, 7, 5)
print(vector)
class(vector)

list = list(4, "name", TRUE) # Содержат разные данные

matrix1 <- matrix(c(1, 2, 3, 4), nrow = 2, ncol = 2) # Произведение nrow*ncol должно быть равно кол-ву элементов в матрице
matrix2 <- matrix(c(5, 6), nrow = 2, ncol = 1)


data_frame <- data.frame(
  participant_id = 1:5,
  age = c(23, 31, 27, 45, 36),
  gender = c("Мужской", "Женский", "Женский", "Мужской", "Не могу определить"),
  group = factor(c("Контроль", "Терапия", "Контроль", "Терапия", "Контроль")),
  cholesterol_after = c('Нормальный', 'Нормальный', 'Повышенный', "Нормальный", "Повышенный"),
  start_date = as.Date(c("2025-04-01", "2025-04-02", "2025-04-03", "2025-04-04", "2025-04-05")),
  stringsAsFactors = FALSE
)

print(data_frame)
class(data_frame)

# Извлечение элементов из данных

vector[1]
vector[2:3]

matrix1[1,2] # первая строка, второй столбец

data_frame[1,2] # аналогично матрице

data_frame$age # Извлекаем целый столбец
data_frame[,"age"] # Некоторые операции могут бытть совершены разными способами. Выбирайте по удобству
data_frame[, 2] # 3-й вариант
data_frame[[2]] # 4-й вариант



# Встроенные фукнции для математических операций

max(vector)

min(vector)

median(vector)

mean(vector)

vector_squared = vector^2
print(vector_squared)

vector_added = vector + 4


# Аналогичные операции можно проделывать с датафреймами

data_frame$squared_age = data_frame$age^2

mean(data_frame$age)
sd(data_frame$age)
summary(data_frame) # Описательные статистики для всех переменных разом

# Одни классы структур данных также возможно конвертировать в другие

data_frame_to_matrix = as.matrix(data_frame) # Матрицы могут содержать элементы только одного класса! В этом случае

class(data_frame_to_matrix[1,5]) # В нашем случае логическое значение 

matrix1 %*% matrix2 # Зато матрицы можно перемножать


# Условия и циклы

for (i in 1:nrow(data_frame)) {
  if (data_frame$cholesterol_after[i] == "Нормальный") {
    data_frame$passed[i] = 1
  } else {
    data_frame$passed[i] = 0
  }
}


# Однако зачастую в R существуют уже готовые векторизованные фнукции. Например, ifelse

data_frame$passed = ifelse(data_frame$cholesterol_after == "Нормальный", 1, 0)


# Написание собственных функций

counter = function(k = 1, times = 2) {
  while (times <= 11) {
    print(k)
    k = k + 1
    times = times + 1
  }
}

counter()

# Функции для генерации данных

set.seed(42)

# Функция генерации возраста от нормального распределения
generate_ages = function(n, min_age = 12, max_age = 80) {
  ages = round(rnorm(n, mean = 40, sd = 15))
  ages = pmin(pmax(ages, min_age), max_age)
  return(ages)
}

# Функция для генерации веса (зависимость от возраста) + шум
generate_weights = function(ages) {
  base_weight = 60 + 0.5 * ages  # baseline linear growth
  noise = rnorm(length(ages), mean = 0, sd = 5)
  return(round(base_weight + noise, 1))
}

# Функция для генерации мышечной массы (зависимость от возраста) + шум
generate_muscle_mass = function(ages) {
  # Peak at age 30, so the curve follows a downward parabola centered at 30
  peak_muscle = 35  # max average muscle mass at peak
  mass = -0.01 * (ages - 35)^2 + peak_muscle
  noise = rnorm(length(ages), mean = 0, sd = 1)
  return(round(mass + noise, 1))
}


# Задание №1: Сгенерируйте переменные age, weight, muscle_mass размером в 2000 наблюдений
age = <YOUR_CODE> # какую функцию использовать? что подать на вход?
weight = <YOUR_CODE> # что подать на вход? уже не n, не так ли?
muscle_mass = <YOUR_CODE> 
  
# Задание №2: Сформируйте единый датасет
  
fitness_data = data.frame(<YOUR_CODE>)
# Задание №3: Вам необходимо создать переменную `standardized_age` (вы уже знаете, как создавать новые переменные)

<YOUR_CODE>


# Задание №4: Наберите в консоль команду ?t.test - вам откроется документация функции. Прочтите и примените на переменной standardized_age

<YOUR_CODE>

# Как бы вы проинтерпретировали результат?

# Задание №5: Посчитайте ковариацию с помощью команды cov(x = age, y = weight) и ст. откл (команды вам уже известны)

<YOUR_CODE>
  

# Задание №6: Самостоятельно посчитайте корреляцию age и weight, используя ковариацию и ст. откл.
  
<YOUR_CODE>
  
  
# Задание №7: Найдите в интернете команду для подсчета корреляции. Сравните полученное вами значение

<YOUR_CODE>
  
  
# Задание №8: Используя найденную вами команду, посчитайте корреляцию age и muscle_mass
  
<YOUR_CODE>
  
# Построим график для наглядности
if (!requireNamespace("ggplot2", quietly = TRUE)) {
  install.packages("ggplot2")
} # Функция, которая проверит наличие необходимого пакета

library(ggplot2) # Загрузка пакета для работы в текущей сессии R
ggplot(fitness_data, aes(x = age, y = muscle_mass)) +
geom_point() +
geom_smooth(method = "loess", se = FALSE) +
labs(title = "Возраст и Мышечная Масса", y = "Мышечная Масса", x = "Возраст") +
theme_minimal()

# Корреляция невысокая. Но зависимость из графика очевидна: увеличивается объем мышц до 35, а затем падает. Как думаете, почему результат корреляции такой?

# Давайте построим регрессию вида Y = c + b*X + e, где e - ошибка

regression_results = lm(muscle_mass ~ 1 + age, data = fitness_data)

# А правильная ли это спецификация модели? Давайте визуализируем

intercept <- coef(regression_results)[1]
slope <- coef(regression_results)[2]

ggplot(fitness_data, aes(x = age, y = muscle_mass)) +
  geom_point() +
  geom_smooth(method = "loess", se = FALSE, color = "red") +  # LOESS
  geom_abline(intercept = intercept, slope = slope, 
              color = "blue", linetype = "dashed") +  # Ручная линия регрессии
  labs(title = "Возраст и Мышечная Масса", 
       y = "Мышечная Масса", 
       x = "Возраст") +
  theme_minimal()

# Задание №9: Постройте корректную спецификацию модели

regression_results_correct = <YOUR_CODE>

# Формула для поиска X, максимизирующего Y: X_max = -b/2a, где a - коэффициент при X^2, b - при X
peak = (-<YOUR_CODE>) / (2 * <YOUR_CODE>)
peak

## ДЗ:

# 1. Откройте файл 'star_wars_force_proficiency.csv' с помощью команды read.csv.

star_wars_force_proficiency = read.csv(<YOUR_CODE>)

# 2. Постройте графики зависимости между force_proficiency и другими переменными (подсказка: вы можете строить несколько графиков на одном рисунке - отыщите подходящую функцию в интернете)

# 3. Представьте, что вы хотите оценить, какое влияние оказывают факторы на force_proficiency. Какой должна быть спецификация? Постройте регрессию, включив только релевантные факторы (не забудьте посмотреть на графики)




