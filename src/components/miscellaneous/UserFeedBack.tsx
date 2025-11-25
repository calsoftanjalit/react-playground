import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Group, Textarea, Rating, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconStar, IconStarFilled, IconUser } from '@tabler/icons-react';
import { saveLocalReview } from '@/utils/reviewStorage';
import queryClient from '@/services/apis/queryClient';
import { UserFeedbackProps } from '@/types';
import styles from '@/styles/UserFeedBack.module.scss';

const UserFeedBack = ({ productId }: UserFeedbackProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: '',
      rating: 0,
      comment: '',
    },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name is too short' : null),
      rating: (value) => (value <= 0 ? 'Please give a rating' : null),
      comment: (value) => (value.trim().length < 5 ? 'Comment is too short' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const newReview = {
      id: crypto.randomUUID(),
      reviewerName: values.name,
      rating: values.rating,
      comment: values.comment,
      date: new Date().toISOString(),
    };
    saveLocalReview(productId, newReview);
    form.reset();
    queryClient.invalidateQueries({ queryKey: ['product', productId] });
    close();
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5:
        return 'Excellent!';
      case 4:
        return 'Great!';
      case 3:
        return 'Good';
      case 2:
        return 'Fair';
      case 1:
        return 'Poor';
      default:
        return '';
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title={
          <div className={styles.modalHeader}>
            <IconStarFilled size={24} className={styles.headerIcon} />
            <span>Share Your Experience</span>
          </div>
        }
        size="md"
        classNames={{
          header: styles.customModalHeader,
          body: styles.customModalBody,
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)} className={styles.reviewForm}>
          <div className={styles.formSection}>
            <TextInput
              label="Your Name"
              placeholder="John Doe"
              {...form.getInputProps('name')}
              className={styles.reviewField}
              leftSection={<IconUser size={18} />}
              size="md"
            />
          </div>

          <div className={styles.formSection}>
            <div className={styles.ratingWrapper}>
              <label className={styles.ratingLabel}>How would you rate your experience?</label>

              <div className={styles.ratingContainer}>
                <div data-testid="rating-input">
                  <Rating
                    size="xl"
                    {...form.getInputProps('rating')}
                    className={styles.ratingStars}
                    emptySymbol={<IconStar size={32} color="#FFD43C" />}
                    fullSymbol={<IconStarFilled size={32} color="#FFD43B" />}
                  />
                </div>

                {form.values.rating > 0 && (
                  <Text span className={styles.ratingText}>
                    {getRatingText(form.values.rating)}
                  </Text>
                )}
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <Textarea
              label="Your Review"
              placeholder="Tell us about your experience..."
              minRows={4}
              {...form.getInputProps('comment')}
              className={styles.reviewField}
              size="md"
            />
            <div className={styles.characterHint}>Share what you loved or what could be better</div>
          </div>

          <Group justify="flex-end" mt="xl" className={styles.reviewActions}>
            <Button variant="subtle" onClick={close} size="md" className={styles.cancelBtn}>
              Cancel
            </Button>

            <Button
              type="submit"
              size="md"
              className={styles.submitBtn}
              leftSection={<IconCheck size={18} />}
            >
              Submit Review
            </Button>
          </Group>
        </form>
      </Modal>

      <Button className={styles.feedbackGroup} size="sm" variant="gradient" onClick={open}>
        Rate Product
      </Button>
    </>
  );
};

export default UserFeedBack;
