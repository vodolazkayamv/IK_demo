import { useRouter } from 'next/router'

import PostTitle from '../../components/post-title'
import Article from '../../components/article'
import PostContent from '../../components/post-content'

const Post = () => {
    const router = useRouter()
    const { slug } = router.query

    const post = {
        title: slug,
        author: "Masha",
        content: "my precious content"
    }

    return (

        <Article>
            <PostTitle post={post}> </PostTitle>
            <PostContent content={post.content} />
        </Article>

    )
}

export default Post