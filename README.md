# Разработка музыкального плеера

Разработка страницы музыкального плеера с возможностью поиска/выбора альбома для воспроизведения.
Адаптивная верстка для устройств с шириной экрана от 320px.

Проект работает в паре с api, который предоставляет данные об имеющихся альбомах и аудиофайлы.

## API проекта

Проект api реализован посредством библиотеки expressjs, с простой маршрутизацией. Данные, предоставляемые api, хранятся в директории **_data_**: файл _albumsData.json_ с описанием модели данных и директория _music_ со вложенными директориями для альбомов. Каждая директория альбома должна хранить треки в формате mp3 и файл изображения для обложки _cover.jpg_.

В общем виде модель данных представлена массивом, содержащим объектные представления информации об альбомах:

```json
[
    {
        "id": "some unique album id",
        "title": "album title",
        "artist": "artist name",
        "genre": "genre description",
        "tracklist": [
            {
                "id": "some unique track id",
                "title": "track title",
                "duration": 123,
                "waveformData": [12, 45, 100]
            }
        ]
    }
]
```

Для простоты поиска и маршрутизации принято соглашение: наименование директории с файлами альбома совпадает с id альбома, а наименования аудиофайлов (не включая расширение .mp3) - с id треков. Длительность указывается в секундах. Массив waveformData содержит информацию, необходимую для уникальной визуализации прогресс-бара плеера и не является обязательным. Данную информацию можно получить, вытянув из аудиофайла набор значений амплитуд (например, с помощью [этого приложения](https://github.com/bbc/audiowaveform)), отфильтровав и нормализовав его (в данном случае визуализация заточена под использование наборов из 100 усредненных значений в диапазоне 3 - 100).

## Клиентская часть проекта

При запуске приложения через api запрашивается информация об имеющихся на сервере альбомах. После получения описаний и изображений, происходит рендеринг альбомов с предварительной сортировкой по указанным в описаниях жанрам.

При клике на альбом открывается панель проигрывателя. Выбор трека для проигрывания выполняется кликом по нему в списке. Постановка на паузу производится повторным кликом на трек.

Визуализация прогресса воспроизведения реализована с использованием элемента canvas. При наличии в модели данных трека массива waveformData визуализация происходит с использованием этих данных. Прогресс-бар является интерактивным, позволяет по клику выполнять навигацию по треку. Также осуществляется отрисовка различными цветами буфферизованной части трека, воспроизведенной части трека, на устройствах без тач-дисплея также отображается hover-эффект. Реализовано адаптивное изменение ширины canvas при изменении размеров окна.

При окончании трека выполняется переход наследующий трек в альбоме. При окончании воспроизведения последнего трека альбома воспроизведение останавливается.

В шапке страницы есть поле ввода для фильтрации имеющихся альбомов. Фильтрация осуществляется по назнанию и исполнителю и производится непосредственно после ввода текста (без подтверждения), debounce составляет 700мс. При наличии в поле ввода текста вместо иконки поиска отображается кнопка очистки поля.

Уведомления об ошибках со стороны api реализованы в виде высплывающих сообщений (скрываются автоматически через 5 сек. или по клику на них).

Реализовано упрощенное управление с клавиатуры: переход по альбомам возможен табуляцией, выбор альбома производится нажатием **Enter** или **Spacebar**. После выбора альбома появляющаяся панель плеера автоматически получает фокус. Навигация по плееру также осуществляется табуляцией, выбранный трек воспроизводится/останавливается нажатием **Enter** или **Spacebar**. Когда фокус находится внутри компонента плеера, дополнительно обрабатываются нажатия:

-   **ArrowRight** и **ArrowLeft** выполняют перемотку трека на +/- 10 сек.
-   **Escape** скрывает панель плеера

## Сборка проекта

```bash
1. git clone https://github.com/Dimeliora/js-music-player
2. cd js-music-player/client
3. npm install
4. cd ../api
5. npm install
```

Для сборки клиентской части проекта используется планировщик задач Gulp.
Скрипты для сборки:

-   serve - сборка в development-режиме и запуск dev-server
-   build - сборка в development-режиме
-   prod - сборка в production-режиме

В режиме production осуществляется минификация HTML, CSS и JS кода, без записи source-map.
В режиме production происходит создание и подключение favicon.

#### ВНИМАНИЕ

Для работы скрипта генерации favicon необходимо наличие файла **_favicon.png_** в директории _src/favicon_, там же расположен файл **_favicon-design.json_** для описания правил отображения иконок на разных устройствах.

Запуск проекта api производится из директории api:

```bash
npm start
```
