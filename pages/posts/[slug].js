import { useRouter } from 'next/router'

import PostTitle from '../../components/post-title'
import Article from '../../components/article'
import PostContent from '../../components/post-content'

import content from '../../data/posts.json'

const Post = ( post ) => {
    const router = useRouter()
    const { slug } = router.query

    return (

        <Article>
            <PostTitle post={post}> </PostTitle>
            <PostContent content={post.content} />
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