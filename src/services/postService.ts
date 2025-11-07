
import { Post } from "../types/post";
import apiClient from "./apis/apiClient";

const POSTS_URL = '/posts'

export const fetchPosts = async (limit: number): Promise<Post[]> => {
  const { data } = await apiClient.get(`${POSTS_URL}?_limit=${limit}`);
  return data;
};

export const fetchPost = async (postId: number): Promise<Post> => {
  const { data } = await apiClient.get(`${POSTS_URL}/${postId}`)
  return data;
}
