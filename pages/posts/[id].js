import { useRouter } from 'next/router'

import PostTitle from '../../components/post-title'

const Post = () => {
    const router = useRouter()
    const { id } = router.query

    const post = {
        title: id,
        author: "Masha"
    }

    return (

        <PostTitle post= {post}  />

    )
}

export default Post