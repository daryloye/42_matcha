import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { picturesAtom } from '../utils/atoms';

function PicturesPreview({ previewList }: { previewList: string[] }) {
  const deletePicture = () => {}

  return (
    <div>
      {previewList.map((file: string) =>
      <div key={file} style={{display: 'flex', flexDirection: 'column'}}>
        <img
          key={file}
          src={file}
          style={{ height: '100px', width: '100px' }}
        />
        <button
          type='button'
          style={{all: 'unset', color: 'white', backgroundColor: 'red', width: '3em'}}
          onClick={() => deletePicture()}
        >
          Delete
        </button>
        </div>
      )}
    </div>
  )
}

function PicturesInput() {
  const [picturesList, setPicturesList] = useAtom(picturesAtom);

  const addPictures = (event: any) => {
    const newPictures = Array.from(event.target.files) as File[];
    setPicturesList((prev) => [...prev, ...newPictures]);
  }

  return (
    <input
      type='file'
      multiple
      onChange={(event) => addPictures(event)}
    />
  )
}

export function ProfileUploadPictures() {
  const [picturesList, setPicturesList] = useAtom(picturesAtom);
  const [previewList, setPreviewList] = useState<string[]>([]);

  useEffect(() => {
    const newPreviewList = picturesList.map((file) => {
      return URL.createObjectURL(file);
    });
    setPreviewList(newPreviewList);
  }, [picturesList])

  return (
    <div>
      <PicturesInput />
      <PicturesPreview previewList={previewList} />
    </div>
  )
}