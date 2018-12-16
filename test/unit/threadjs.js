import Thread from '../../src/ThreadJS';

describe('Thread', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(Thread, 'greet');
      Thread.greet();
    });

    it('should have been run once', () => {
      expect(Thread.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(Thread.greet).to.have.always.returned('hello');
    });
  });
});
