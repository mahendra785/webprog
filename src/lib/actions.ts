'use server'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function getVideoDetails(videoId: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`
    )
    const data = await response.json()

    if (data.items?.length === 0) {
      throw new Error('Video not found')
    }

    return {
      title:'asas',
      description: 'a',
      thumbnail: 'a',
    }
  } catch (error) {
    console.error('Error fetching video details:', error)
    return {
      title: 'Party Watch',
      description: 'Watch videos together with friends',
      thumbnail: '',
    }
  }
}