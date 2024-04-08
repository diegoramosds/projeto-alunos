import React from 'react';
import PropTypes from 'prop-types';
import { Container } from './styled';
import { FaSpinner } from 'react-icons/fa';

export default function Loading({ isLoading }) {
  if (!isLoading) return <></>;
  return (
    <Container>
      <div />
      <span>
        <FaSpinner />
      </span>
    </Container>
  );
}
Loading.defaultProps = {
  isLoading: false,
};

Loading.propTypes = {
  isLoading: PropTypes.bool,
};
