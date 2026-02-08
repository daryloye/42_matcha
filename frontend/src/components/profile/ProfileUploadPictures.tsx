import { useAtom } from 'jotai';
import { picturesAtom } from '../../utils/atoms';
import type { PictureItem } from '../../utils/types';

function PicturesView() {
  const [picturesList, setPicturesList] = useAtom(picturesAtom);

  const deletePicture = (item: PictureItem) => {
    URL.revokeObjectURL(item.url);
    setPicturesList((prev) => {
      return prev.filter((p) => p !== item);
    });
  };

  return (
    <div>
      {picturesList.map((item) => (
        <div
          key={item.url}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={item.url} style={{ height: '100px', width: '100px' }} />
          <button
            type='button'
            className='profile-util-button'
            style={{ backgroundColor: 'red' }}
            onClick={() => deletePicture(item)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function PicturesInput() {
  const [_, setPicturesList] = useAtom(picturesAtom);

  const addPictures = (event: any) => {
    const files = Array.from(event.target.files) as File[];

    setPicturesList((prev) => [
      ...prev,
      ...files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  return (
    <input type='file' multiple onChange={(event) => addPictures(event)} />
  );
}

export function ProfileUploadPictures() {
  return (
    <div>
      <PicturesInput />
      <PicturesView />
    </div>
  );
}
