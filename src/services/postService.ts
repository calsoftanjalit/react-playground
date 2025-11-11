import { PostInterface } from '@/types';
import apiClient from '@/services/apis/apiClient';

const POSTS_URL = '/posts';

export const fetchPosts = async (limit: number): Promise<PostInterface[]> => {
  const { data } = await apiClient.get(`${POSTS_URL}?_limit=${limit}`);
  return data;
};

export const fetchPost = async (postId: number): Promise<PostInterface> => {
  const { data } = await apiClient.get(`${POSTS_URL}/${postId}`);
  return data;
};
