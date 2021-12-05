import Head from 'next/head'
import styles from '../styles/Home.module.css'

import content from '../data/posts.json'
import dynamic from 'next/dynamic'

const PlotComponent = dynamic(() => import('react-plotly.js'), {
    ssr: false
})

export default function Home() {

  const allPosts = content.posts

  var xData = []
  var yData = []
  var sum = 0
  var traces = []

  allPosts.forEach((post) => {
    var days = post.days
    var trace = {
      x: [],
      y: [],
      name: post.title,
      type: 'bar'
    }
    days.forEach((day) => {
      var date = new Date(day.date)
      trace.x.push(date)
      trace.y.push(day.fishes)
      sum += day.fishes
    })
    traces.push(trace)
  })
  var data = traces
  var layout = {
    xaxis: {title: 'Дата'},
    yaxis: {title: 'Выявлено рыб'},
    barmode: 'relative',
    title: 'Статистика по всем окнам'
  };

  var dataIndicator = [
       
    {
      type: "indicator",
      mode: "number+delta",
      value: sum,
      title: {
        text:
          "Всего рыб<br><span style='font-size:0.8em;color:gray'>за период</span><br><span style='font-size:0.8em;color:gray'>прошли через рыбоучетное заграждение</span>"
      },
      delta: { reference: 1400000, relative: false },
      domain: { x: [0.6, 1], y: [0, 1] }
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
         
        </p>

        {
          allPosts.map(function(post) {
            return (
              <a href={"/posts/" + post.slug} className={styles.card}>
                <h2>{post.title}</h2>
                <p>{post.slug}</p>
              </a>
            )
          })
        }

      <PlotComponent data={data}  layout={layout} />
      <PlotComponent data={dataIndicator} />

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
