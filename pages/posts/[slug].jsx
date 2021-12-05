import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import PostTitle from '../../components/post-title'
import Article from '../../components/article'
import PostContent from '../../components/post-content'

import content from '../../data/posts.json'
import data from '../../data/barriers.json'

import dynamic from 'next/dynamic'

const PlotComponent = dynamic(() => import('react-plotly.js'), {
    ssr: false
})

import axios from 'axios';
import React from 'react';

const Post = ( post ) => {
    const router = useRouter()
    const { slug } = router.query

    const [barrier, setBarrier] = useState(null); 
    const [barrierInfo, setBarrierInfo] = useState(null); 

    useEffect(() => {
        getBarriers()
        getBarrierInfo()
    }, []);
    const getBarriers = async (event) => {
               
        const response = await axios.get('https://lapki.appmat.org/api/barriers/'+slug);
        console.log('response', response.data);
        setBarrier(response.data);
      };

      const getBarrierInfo = async (event) => {
               
        const response = await axios.get('https://lapki.appmat.org/api/barriers/'+slug+'/observations');
        console.log('response', response.data);
        setBarrierInfo(response.data);
      };

      var xData = []
      var yData = []
      var sum = 0
      post.days.forEach((day) => {
        console.log('day', day)
        var date = new Date(day.date)
        xData.push(date)
        yData.push(day.fishes)
        sum += day.fishes
      })

      var data = [
        {
            x: xData,
            y: yData,
            type: 'bar'
          }
      ];

      var dataIndicator = [
       
        {
          type: "indicator",
          mode: "number",
          value: sum,
          title: {
            text:
              "Всего рыб<br><span style='font-size:0.8em;color:gray'>за период</span><br><span style='font-size:0.8em;color:gray'>прошли через это окно</span>"
          },
          
          domain: { x: [0.6, 1], y: [0, 1] }
        }
      ];

      var layout = {
        xaxis: {
            categoryorder : "category ascending"
        }
      };

    return (

        <Article>
            <PostTitle post={post}> </PostTitle>
            
            <PlotComponent data={data}  layout={layout} />
            <PlotComponent data={dataIndicator} />
        </Article>

    )
}

export async function getStaticPaths() {
    const posts = content.posts

    const paths = posts.map((post) => ({
        params: {slug: post.slug}
    }))

    return {paths, fallback: false}
}

export async function getStaticProps( {params} ) {
    const currentPost = content.posts.find(post => {
        return post.slug == params.slug
    })

    return { props: currentPost }
}

export default Post