import styles from '../styles/blog.module.css'

export default function PostTitle({ post }) {
    return (
        <>
          <div >

            <h1 >
              { post.title }
            </h1>
            
            by <div className={styles.author}>  { post.author } </div>
          </div>

      </>
    )
  }