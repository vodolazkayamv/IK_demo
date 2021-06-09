import styles from '../styles/blog.module.css'

export default function PostTitle({ post }) {
    return (
        <>
          <div className={styles.postInfo}>

            <h1>
              { post.title }
            </h1>

            Author: <div className={styles.author}>  { post.author } </div>

          </div>

      </>
    )
  }