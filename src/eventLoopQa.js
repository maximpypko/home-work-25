// // 1
// console.info("foo");
// console.info("bar");
// console.info("baz");
// // синхронный код выполняется по порядку

// // 2
// console.info("foo");
// setTimeout(() => console.info("bar"), 1000);
// console.info("baz");
// // foo
// // baz
// // bar
// // console.info("foo") попадает в callstack, выполняется.
// setTimeout попадает в callstack, переходит в Web api, начинается отсчёт таймера
//setTimeout, когда таймер закончил отсчёт console.info переходит в task queue, где ждёт когда освободится callstack
// // console.info("baz") попадает в callstack, выполняется.
// // когда callstack освобождается от задач, происходит 'тик' цикла событий и
//console.info из task queue переходит в callstack, выполняется.

// // 3
// console.info("foo");
// setTimeout(() => console.info("bar"), 0);
// console.info("baz");
// // foo
// // baz
// // bar
// // аналогично предыдущей задаче

// // 4
// const timer = setInterval(() => {
//   console.info("foo");
//   setTimeout(() => clearTimeout(timer), 0);
// }, 1000);
// setTimeout(() => console.info("bar"), 1000);
// console.info("baz");
// // baz
// // foo
// // bar
// // setInterval попадает в callstack, переходит в Web api, начинается отсчёт таймера,
//когда таймер закончил отсчёт console.info переходит в task queue, где ждёт когда освободится callstack
// // setTimeout попадает в callstack, переходит в Web api, начинается отсчёт таймера,
//когда таймер закончил отсчёт console.info переходит в task queue, где ждёт когда освободится callstack
// // console.info("baz")попадает в callstack, выполняется
// // когда callstack освобождается происходит 'тик' цикла событий и console.info("foo")
//из task queue переходит в callstack, выполняется. setTimeout встроенный  в setInterval идет на второй круг.
// // когда callstack освобождается, происходит 'тик' цикла событий и console.info("bar")
// из task queue переходит в callstack, выполняется
// // когда callstack освобождается, происходит 'тик' цикла событий clearTimeout(timer)
// из task queue переходит в callstack, выполняется

// // 5
// const timer = setInterval(() => {
//   setTimeout(() => {
//     console.info("foo");
//     clearTimeout(timer);
//   }, 0);
// }, 1000);
// setTimeout(() => console.info("bar"), 1000);
// console.info("baz");
// // baz
// // bar
// // foo
// // setInterval->callstack->web api(пошел и закончился отсчёт)->task queue
// // setTimeout->callstack->web api(пошел и закончился отсчёт)->task queue
// // console.info("baz")->callstack(выполняется)
// // callstack очистился->тик, setTimeout из task queue попадает в callstack->
// //web api (пошел и закончился отсчёт)->task queue
// // console.info("bar") из task queue->callstack(выполняется)
// // callstack очистился->тик, console.info("foo") из task queue->callstack(выполняется)
// // callstack очистился->тик, clearTimeout(timer)->callstack(выполняется)

// // 6
// Promise.resolve("foo").then((res) => console.info(res));
// setTimeout(() => console.info("bar"), 0);
// console.info("baz");
// // baz
// // foo
// // bar
// // promise->callstack->web api->job queue
// // setTimeout->callstack->web api->job queue
// // console.info("baz")->callstack (выполняется)
// // callstack очистился->тик, console.info(res) из job queue->callstack (выполняется)
// // callstack очистился->тик, console.info("bar") из task queue->callstack (выполняется)

// // 7
// setTimeout(() => console.info("foo"), 0);
// Promise.resolve("bar").then((res) => console.info(res));
// console.info("baz");
// setTimeout(() => console.info("foo2"), 0);
// Promise.resolve("bar2").then((res) => console.info(res));
// console.info("baz2");
// // baz
// // baz2
// // bar
// // bar2
// // foo
// // foo2
// // setTimeout->callstack->web api->task queue
// // Promise.resolve("bar")->callstack->web api->job queue
// // console.info("baz")->callstack(выполняется)
// // setTimeout2->callstack->web api->task queue
// // Promise.resolve("bar2")->callstack->web api->job queue
// // console.info("baz2")->callstack(выполняется)
// // callstack очистился->тик, console.info(res) из job queue->callstack(выполняется)
// // callstack очистился->тик, console.info(res2) из job queue->callstack(выполняется)
// // callstack очистился->тик, console.info("foo") из task queue->callstack(выполняется)
// // callstack очистился->тик, console.info("foo2") из task queue->callstack(выполняется)

// // 8
// setTimeout(() => Promise.resolve("foo").then((res) => console.info(res)), 1000);
// Promise.resolve("bar").then((res) => {
//   setTimeout(() => console.info(res), 1000);
// });
// console.info("baz");
// // baz
// // foo
// // bar
// // setTimeout->callstack->web api->task queue
// // Promise.resolve("bar")->callstack->web api->job queue
// // console.info("baz")->callstack(выполняется)
// // callstack очистился->тик, Promise.resolve("foo")->callstack->web api->job queue
// // callstack очистился->тик, setTimeout2->callstack->web api->task queue
// // callstack очистился->тик, console.info(res) из job queue->callstack(выполняется)
// // callstack очистился->тик, console.info(res) из task queue->callstack(выполняется)

// // 9
// setTimeout(() => Promise.resolve("foo").then((res) => console.info(res)), 1000);
// Promise.resolve("bar").then((res) => {
//   setTimeout(() => console.info(res), 500);
// });
// console.info("baz");
// // baz
// // bar
// // foo
// // setTimeout->callstack->web api(таймер начал отсчет)
// // Promise->callstack->web api->job queue
// // console.info("baz")->callstack(выполняется)
// // setTimeout2->callstack->web api(таймер начал отсчет,закончил отчет)->task queue->callstack(выполняется)
// // setTimeout(таймер закончил отчет)->task queue
// // callstack очистился->тик, console.info(res)->callstack(выполняется)
// // я так понимаю что в какой-то момент времени в web api есть два таймера,
// // тот который первый закончит отсчет тот первый попадет в task queue и соответственно в callstack.

// // 10
// (async () => {
//   const result = await Promise.resolve('foo');
//   console.info(result);
// })();
// setTimeout(() => console.info('bar'), 0);
// console.info('baz');
// // baz
// // foo
// // bar
// // async->callstack->web api->task queue
// // setTimeout->callstack->web api->task queue
// // console.info("baz")->callstack(выполняется)
// // callstack очистился->тик,console.info(result) ждет выполнения promise(выполняется)
// // callstack очистился->тик, console.info('bar')->callstack(выполняется)

// // 11
// setTimeout(console.info("foo"), 0);
// console.info("bar");

// (async () => {
//   const result = await Promise.resolve("baz");
//   console.info(result);
// })();
// // foo
// // bar
// // baz
// // функция setTimeout не объявлена, поэтому первая console.info("foo")
// // дальше все как обычно