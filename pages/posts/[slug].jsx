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
    const [observations, setObservations] = useState(null); 

    const [image, setImage] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

    useEffect(() => {
        getBarriers()
        getBarrierInfo()
        getObservations()
    }, []);
    const getBarriers = async (event) => {
               
        const response = await axios.get('https://lapki.appmat.org/api/barriers/'+slug);
        // console.log('response', response.data);
        setBarrier(response.data);
      };

      const getBarrierInfo = async (event) => {
               
        const response = await axios.get('https://lapki.appmat.org/api/barriers/'+slug+'/observations');
        // console.log('response', response.data);
        setBarrierInfo(response.data);
      };

      var xData = []
      var yData = []
      var sum = 0
      post.days.forEach((day) => {
        // console.log('day', day)
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


      const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
          const i = event.target.files[0];
    
          setImage(i);
          setCreateObjectURL(URL.createObjectURL(i));
        }
      };

      const uploadToServer = async (event) => {
        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            onUploadProgress: (event) => {
              console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
            },
          };

          Date.prototype.yyyymmdd = function() {
            var mm = this.getMonth() + 1; // getMonth() is zero-based
            var dd = this.getDate();
            var hours = this.getHours();
            var minutes = this.getMinutes();
          
            return [this.getFullYear(),
                    (mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd,
                   ].join('-');
          };
          
          var date = new Date();
          date.yyyymmdd();

        const body = new FormData();
        body.append("file", image);
        body.append("date",  date.yyyymmdd());
        
        const response = await axios.post('https://lapki.appmat.org/api/barriers/'+slug+'/observations', body, config);
        console.log('response', response.data);

        getObservations()
      };

      const getObservations = async (event) => {

        const response = await axios.get('https://lapki.appmat.org/api/barriers/2/observations');
        console.log(response)
        function filterByID(item) {
            if (item.barrierId == slug) {
              return true
            }
            return false;
          }

          let observationsByID = response.data.filter(filterByID)
        //   console.log(observationsByID)
          setObservations(observationsByID)

          
      }

      var observationsTrace = {
        x: [],
        y: [],
        type: 'bar'
      }
      var observationsSum = 0
      if (observations) {
      observations.forEach((observation) => {
          var date = new Date(observation.date)
          var fishes = observation.fish
          observationsTrace.x.push(date)
          observationsTrace.y.push(fishes)
          observationsSum += fishes
      })
    }
      var observationsData = [observationsTrace]
      var observationsDataIndicator = [
       
        {
          type: "indicator",
          mode: "number",
          value: observationsSum,
          title: {
            text:
              "Всего рыб<br><span style='font-size:0.8em;color:gray'>за период</span><br><span style='font-size:0.8em;color:gray'>прошли через это окно</span>"
          },
          
          domain: { x: [0.6, 1], y: [0, 1] }
        }
      ];
    return (

        <Article>
            <PostTitle post={post}> </PostTitle>
            
            <h2>Демонстрационные данные:</h2>

            <PlotComponent data={data}  layout={layout} />
            <PlotComponent data={dataIndicator} />

            <h2>Загруженные данные:</h2>


            <PlotComponent data={observationsData}  layout={layout} />
            <PlotComponent data={observationsDataIndicator} />


            <input type="file" name="image" onChange={uploadToClient} multiple="multiple" />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button>


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